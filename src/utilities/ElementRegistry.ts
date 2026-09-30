import type { ElementSchema } from '../types/Schema.js';

/**
 * `block-json` 코드펜스로 만들 수 있는 블록의 허용 목록.
 *
 * `block-json` 은 LLM 출력이다 — 프롬프트 인젝션(검색 문서·첨부·도구 결과)으로 제3자가 쓸 수
 * 있는 입력이라, «등록된 커스텀 엘리먼트면 무엇이든 만든다 + 위험한 속성 이름만 막는다» 는
 * 경계가 되지 못한다. 페이지에는 신뢰된 HTML 을 받는 속성을 가진 엘리먼트가 있고, 거부 목록은
 * 그 이름을 모른다.
 *
 * ⇒ **LLM 에게 알린 스키마가 곧 허용 목록이다.** 태그는 스키마로 등록된 것만, 속성은 그
 * 스키마의 `properties` 에 적힌 이름만 대입한다. 스키마는 이미 LLM 과의 계약이므로 두 번째
 * 목록을 따로 유지할 필요가 없다.
 */
const blocks = new Map<string, ReadonlySet<string>>();

/**
 * 블록을 `block-json` 으로 렌더할 수 있게 등록합니다.
 *
 * 내장 블록(chart/images/map/video)은 모듈을 import 하면 스스로 등록되고,
 * `ElementPromptBuilder.add()` 로 추가한 스키마도 함께 등록됩니다.
 * 같은 태그를 다시 등록하면 속성 목록을 새 스키마로 바꿉니다.
 */
export function registerElementBlock(schema: Pick<ElementSchema, 'tag' | 'properties'>): void {
  const tag = schema.tag.trim().toLowerCase();
  blocks.set(tag, new Set(Object.keys(schema.properties ?? {})));
}

/**
 * 등록된 블록이면 대입을 허용하는 속성 이름 집합을, 아니면 `undefined` 를 돌려줍니다.
 */
export function getElementBlockProperties(tag: string): ReadonlySet<string> | undefined {
  return blocks.get(tag.trim().toLowerCase());
}
