import { sanitizeHref } from './sanitizers.js';

/**
 * 모델 출력이 불러오는 이미지의 출처 정책 — 페이지 전체에 하나다(CSP `img-src` 와 같은 범위).
 *
 * 마크다운 이미지(`u-marked-block`)와 `u-images-block` 은 모델이 쓴 URL 을 그대로 요청한다.
 * 프롬프트 인젝션된 응답은 이미지 URL 의 쿼리에 데이터를 실어 제3자에게 보낼 수 있다 —
 * 요청은 렌더되는 순간 일어나므로 사용자가 아무것도 누르지 않아도 된다.
 *
 * 기본값은 `undefined`(전부 허용 — 종전 동작)다. 목록을 주면 절대 URL 이 그 접두 중 하나로
 * 시작하는 이미지만 불러오고, 나머지는 요청 없이 «차단된 이미지» 로 그린다.
 * `data:image/…` 는 요청이 없으므로 정책과 무관하게 그린다.
 */
let allowedPrefixes: readonly string[] | undefined;

/** 요청 없이 그려지는 인라인 이미지 */
const DATA_IMAGE_REGEX = /^data:image\/[a-z0-9.+-]+[;,]/i;

/**
 * 모델 출력의 이미지가 불러올 수 있는 URL 접두를 정합니다. 렌더하기 전에 한 번 부르세요 —
 * 이미 그려진 블록은 다음 렌더 때 따릅니다.
 *
 * - `undefined`: 전부 허용(기본값).
 * - `[]`: 전부 차단.
 * - `['*']`: 전부 허용(명시).
 * - `['https://cdn.example.com/images/']`: 이 접두로 시작하는 것만.
 *
 * 접두는 **해석된 절대 URL** 과 비교합니다 — 상대 경로는 `document.baseURI` 기준으로 풀린 뒤
 * 비교되므로, 같은 출처 이미지를 허용하려면 `location.origin + '/'` 를 넣으세요.
 * ⚠도메인 전체(`https://example.com/`)보다 경로(`https://example.com/images/`)를 주세요 —
 * 허용한 도메인에 열린 리다이렉트가 있으면 그것을 거쳐 다른 곳으로 나갈 수 있습니다.
 *
 * @example
 * setAllowedImagePrefixes([location.origin + '/', 'https://cdn.example.com/images/']);
 */
export function setAllowedImagePrefixes(prefixes?: readonly string[]): void {
  allowedPrefixes = prefixes ? [...prefixes] : undefined;
}

/** 현재 이미지 출처 정책을 돌려줍니다(`undefined` = 전부 허용). */
export function getAllowedImagePrefixes(): readonly string[] | undefined {
  return allowedPrefixes;
}

/**
 * 모델이 쓴 이미지 URL 을 정책에 대어 봅니다. 불러와도 되면 프로토콜 검사를 거친 URL 을,
 * 아니면 `null` 을 돌려줍니다(요청하지 말 것).
 */
export function resolveImageSource(src: string): string | null {
  // `data:image/…` 는 요청이 없고(반출 경로가 아니다) `<img>` 안에서는 스크립트도 돌지 않는다 —
  // 정책과 무관하게 보인다. 링크용 검사(`sanitizeHref`)는 `data:` 전체를 막으므로 그 앞에서 가른다.
  const trimmed = src.trim();
  if (DATA_IMAGE_REGEX.test(trimmed)) return trimmed;

  const safe = sanitizeHref(src);
  if (safe === '#') return null;
  if (!allowedPrefixes) return safe;
  if (allowedPrefixes.includes('*')) return safe;

  let absolute: string;
  try {
    absolute = new URL(safe, document.baseURI).href;
  } catch {
    return null;
  }
  return allowedPrefixes.some((prefix) => absolute.startsWith(prefix)) ? safe : null;
}
