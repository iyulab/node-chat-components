import { describe, it, expect, beforeEach, beforeAll } from 'vitest';

/**
 * **WCAG 2.2 SC 2.5.8 Target Size (Minimum) — 24×24 CSS px** 게이트.
 *
 * `@iyulab/components` 의 같은 이름 파일(cycle-479~492)에서 이식했다. 판정 규칙·간격 예외
 * 모델링·전수 대응 단언은 **같은 형태**이고, 다른 것은 이 패키지의 구성뿐이다. 왜 그렇게
 * 생겼는지의 근거는 그쪽 파일 머리말이 정본이므로 여기서 되풀이하지 않는다 — 여기에는
 * **이 패키지에서만 참인 것**만 적는다.
 *
 * ## ⚠ 이 패키지에서 다른 점 — 엔트리가 둘이다
 *
 * `exports` 가 `.` 말고 **`./extra`** 도 공개한다(chart·images·map·video). 배럴 하나만
 * 임포트하면 그 넷이 **등록되지 않은 채** 도출에서 빠지고, 그러면 「전수 대응」 단언이
 * *"분류표가 완전하다"* 고 **거짓으로** 말한다. ⇒ 둘 다 임포트한다.
 *
 * ## ⚠ 이 패키지의 타깃은 대부분 «블록 안의 부수 컨트롤»이다
 *
 * 대화 블록 자체는 표시물이라 포인터 타깃이 아니고, 재야 할 것은 그 안의 복사 버튼·참조
 * 배지·카드 링크처럼 **사용자가 활성화하는 것**이다. 그래서 `targets()` 를 쓰는 픽스처
 * 비중이 `components` 보다 높다.
 */

const MIN = 24;

interface Measured {
  w: number;
  h: number;
  cx: number;
  cy: number;
}

function measure(el: Element): Measured {
  const r = el.getBoundingClientRect();
  return { w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
}

/** SC 2.5.8 «간격 예외» — 중심 간 거리가 24px 이상이면 24px 원이 겹치지 않는다. */
function spacingSatisfied(target: Measured, others: Measured[]): boolean {
  return others.every((o) => Math.hypot(target.cx - o.cx, target.cy - o.cy) >= MIN);
}

type Verdict = 'meets-size' | 'exempt-by-spacing' | 'undersized';

function judge(target: Measured, others: Measured[]): Verdict {
  if (target.w >= MIN && target.h >= MIN) return 'meets-size';
  return spacingSatisfied(target, others) ? 'exempt-by-spacing' : 'undersized';
}

/**
 * 섀도 DOM 안쪽에서 셀렉터로 고른다.
 *
 * ⚠`components` 쪽 게이트는 `part` 로 고르는 헬퍼를 따로 두지만 **여기서는 쓰지 않는다** —
 * 이 패키지의 타깃은 대부분 `part` 가 붙지 않은 내부 컨트롤(`button.nav-button` ·
 * `a.caption` · `th`)이라 셀렉터 하나로 충분하다. 쓰지 않는 헬퍼를 «나중에 쓸지도»로
 * 남겨 두면 그것이 곧 고아 코드다.
 */
function inShadow(host: Element, sel: string): Element[] {
  const root = (host as HTMLElement & { shadowRoot?: ShadowRoot }).shadowRoot;
  return root ? Array.from(root.querySelectorAll(sel)) : [];
}

// ---------------------------------------------------------------------------
// 규칙 — 손으로 쓴다 (도출할 수 없는 우리 지식)
// ---------------------------------------------------------------------------

/**
 * 포인터 타깃이 아닌 것 — 대화 스트림에 그려지는 **표시물**과 레이아웃 컨테이너.
 * 사용자가 «활성화»하는 영역이 아니므로 자를 대면 정당한 블록 전건에 발화한다.
 */
const NOT_A_TARGET = new Set<string>([
  // 표시 전용 — 사용자가 활성화하는 영역이 없다.
  'u-element-block', 'u-text-block', 'u-message', 'u-video-block',

  // 🔴**타깃이 «형제 컴포넌트»인 것 — 그 크기는 `@iyulab/components` 의 계약이다.**
  //   `u-code-block` 은 `u-copy-button`, `u-chart-block`·`u-prompt` 는 `u-button` 을 놓을
  //   뿐이고 치수를 정하지 않는다. 여기서 또 재면 판정이 두 곳으로 갈려 드리프트하고,
  //   우리가 고칠 수 없는 미달이 이 스위트를 빨갛게 만든다. 그쪽 게이트가 이미 잰다.
  'u-code-block', 'u-chart-block', 'u-prompt',

  // 🔴**SC 2.5.8 「인라인」 예외** — 마크다운 본문 안의 링크는 문장 안에 놓이고 그 크기는
  //   본문 `line-height` 가 정한다. 자를 대면 ***정당한 산문에 전건 발화***한다.
  'u-marked-block',
]);

/**
 * 타깃을 «갖고 있지만» 아직 대표 픽스처를 쓰지 않은 것.
 * ⚠**이 목록은 「통과」가 아니라 「미판정」이다.**
 */
const NEEDS_FIXTURE = new Set<string>([
  // (비어 있다) `u-file-block` 이 마지막이었다 — 그 타깃은 카드를 눌러 미리보기를 연 뒤에만
  // 렌더되는데, 픽스처가 `prepare` 로 그 상태를 만들어 이제 잰다(아래 FIXTURES).
]);

/**
 * 🔴**측정 결과 미달인데 «치수를 올리는 것이 시각적 공개 계약 변경»이라 사람 판단이 필요한 것.**
 * 여기 있는 동안 이 파일은 그것을 **미달로 단언**하므로 스위트는 초록이고, 치수를 올리면
 * 빨개진다 — 그때 이 집합에서 빼는 것이 완료 신호다.
 */
const UNDERSIZED_PINS = new Set<string>([]);

/**
 * 🔴**SC 2.5.8 「인라인」 예외** — *"타깃이 문장 안에 있거나, 그 크기가 타깃 아닌 텍스트의
 * `line-height` 에 의해 제약되는 경우"* 는 규격이 명시적으로 면제한다.
 *
 * `u-ref-tag` 는 답변 본문 **문장 안에** 삽입되는 인용 배지다(마크다운 렌더가 `ref` 자리
 * 표시자를 이 태그로 바꾼다). 실측 **10×15** 인데, 이것을 24px 로 키우면 ***줄 높이를 밀어
 * 본문 조판이 깨진다*** — 규격이 이 예외를 둔 이유가 정확히 그것이다.
 *
 * ⚠**면제는 이름으로 좁게 준다** — 「인라인처럼 보이는 것」을 자동 판정하려면 문맥을 읽어야
 * 하고, 넓은 면제는 조용한 미탐이 된다(`u-widgets` 게이트가 같은 규칙을 같은 이유로 쓴다).
 * ⚠**면제해도 재기는 한다** — 픽스처를 유지하므로 실측값이 테스트 이름과 함께 보고된다.
 */
const INLINE_PROSE = new Set(['u-ref-tag']);

interface Fixture {
  html: string;
  /** 이 픽스처 안의 «타깃»들. 생략하면 태그 자신. */
  targets?: (tag: string) => Element[];
  /**
   * 🔴**이 컴포넌트가 «타깃들 사이의 간격»을 스스로 소유하는가.** 기본값은 «간격 예외를
   * 쓰지 않는다»(크기로만 판정) — 고립 픽스처에 예외를 적용하면 무엇이든 통과한다.
   */
  spacingIsOurs?: true;
  /** 렌더가 비동기인 블록(마크다운 파싱·이미지 로드 등)을 위한 추가 대기(ms). */
  settle?: number;
  /**
   * 🔴**타깃이 «열린 상태»에서만 렌더되면 재기 전에 그 상태를 만든다**(`HD-46`).
   * 닫힌 상태로 재면 타깃이 없으므로 «타깃 0개» 단언이 빨강을 낸다 — 그것이 정상이다.
   * ⚠사용자와 같은 경로(클릭·키)로 연다. 내부 상태를 직접 세우면 «그 경로로 열리는가»가
   * 빠지고, 열리지 않는 오버레이를 재고 통과하는 미탐이 된다.
   */
  prepare?: (host: Element) => Promise<void>;
  /**
   * 한 태그를 여러 상태로 잴 때 그 상태의 이름(테스트 이름에 붙는다).
   * 🔴**커버리지는 태그가 아니라 상태 단위로 센다** — 태그 단위로 세면 닫힌 상태 하나만 재도
   * «판정» 이 되어, 열린 상태의 타깃이 빠진 것을 아무것도 말하지 않는다(`u-images-block` 실례).
   */
  state?: string;
}

/** 실제로 재는 것 — 대표 픽스처와 그 안의 타깃. 한 태그에 상태가 여럿이면 배열로 둔다. */
const FIXTURES: Record<string, Fixture | Fixture[]> = {
  'u-ref-tag': {
    html: '<u-ref-tag href="https://example.com">1</u-ref-tag>',
    targets: () => inShadow(document.querySelector('u-ref-tag')!, 'a'),
  },
  'u-ref-card': {
    html: '<u-ref-card url="https://example.com" title="Title" snippet="Snippet"></u-ref-card>',
    targets: () => inShadow(document.querySelector('u-ref-card')!, 'a'),
  },
  'u-ref-block': {
    html: '<u-ref-block title="References"></u-ref-block>',
    targets: () => inShadow(document.querySelector('u-ref-block')!, 'button.header'),
  },
  'u-map-block': {
    html: '<u-map-block lat="37.5" lng="127.0" label="Seoul"></u-map-block>',
    targets: () => inShadow(document.querySelector('u-map-block')!, 'a.caption'),
  },
  'u-ref-card-group': {
    // ⚠헤더(이전/다음)는 **카드가 둘 이상일 때만** 렌더된다 — 하나만 넣으면 `hidden` 이라
    //   0x0 이 나오고 그것을 «통과»로 읽으면 미탐이다(cycle-485~486 이 세 번 밟은 함정).
    html: '<u-ref-card-group>' +
      '<u-ref-card url="https://example.com/1" title="A"></u-ref-card>' +
      '<u-ref-card url="https://example.com/2" title="B"></u-ref-card>' +
      '</u-ref-card-group>',
    targets: () => inShadow(document.querySelector('u-ref-card-group')!, 'button.nav-button'),
    /* 🔴**`spacingIsOurs` 를 켜지 않는다 — 켰다가 네거티브 컨트롤이 침묵해서 껐다.**
       이전/다음 버튼은 헤더 **양 끝**에 있어 중심 간 거리가 실측 **354px** 다. 그러면 간격
       예외가 «크기와 무관하게» 항상 성립해, 버튼을 10×10 으로 줄여도 게이트가 초록이었다.
       ⇒ 판정 기준은 «우리가 배치를 소유하는가»가 아니라 ***«그 예외가 실제로 일하는가»*** 다:
       타깃이 서로 붙어 있어(별점 심볼·표 헤더 셀·썸네일) 크기로만 재면 정당한 배치에
       발화하는 경우에만 켠다. 멀리 떨어진 둘에 켜면 예외가 하는 일은 미탐뿐이다. */
  },
  'u-table-block': {
    // 정렬 가능한 헤더 셀이 우리 소유 타깃이다(다운로드 버튼은 형제 `u-button` 이다).
    html: `<u-table-block headers='["A","B"]' rows='[["1","2"],["3","4"]]'></u-table-block>`,
    targets: () => inShadow(document.querySelector('u-table-block')!, 'th'),
    spacingIsOurs: true,
  },
  'u-images-block': [
    {
      state: '썸네일',
      // 클릭 핸들러가 붙은 `.slide` 가 우리 소유 타깃이다.
      // ⚠항목 키는 `src` 다(`ImageItem`) — 종전 픽스처는 `url` 을 넘겨 **이미지 없이** 그려지고
      //   있었고, 셀렉터 `.thumb, .item` 은 현재 마크업에 없는 이름이었다(`img` 만 걸렸다).
      html: `<u-images-block items='[{"src":"data:image/gif;base64,R0lGODlhAQABAAAAACw="},` +
        `{"src":"data:image/gif;base64,R0lGODlhAQABAAAAACw="}]'></u-images-block>`,
      targets: () => inShadow(document.querySelector('u-images-block')!, '.slide'),
      spacingIsOurs: true,
      settle: 200,
    },
    {
      state: '라이트박스',
      // 🔴**가운데 장을 연다** — 이전/다음은 첫 장·끝 장에서 `hidden` 이라 셋이 모두 보이는 것은
      //   가운데뿐이다. 둘만 넣고 첫 장을 열면 «이전» 이 0×0 으로 잡혀 빨강이 난다.
      html: `<u-images-block items='[{"src":"data:image/gif;base64,R0lGODlhAQABAAAAACw="},` +
        `{"src":"data:image/gif;base64,R0lGODlhAQABAAAAACw="},` +
        `{"src":"data:image/gif;base64,R0lGODlhAQABAAAAACw="}]'></u-images-block>`,
      settle: 200,
      prepare: async (host) => {
        (host.shadowRoot!.querySelectorAll('.slide')[1] as HTMLElement).click();
        await (host as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
      },
      // 닫기(우상단)와 이전/다음(양 끝)은 서로 멀다 — 간격 예외를 켜면 미탐만 한다(`u-ref-card-group` 참조).
      targets: () => inShadow(document.querySelector('u-images-block')!, '.lb-close, .lb-nav'),
    },
  ],
  'u-file-block': {
    // 우리 소유 타깃은 미리보기의 닫기 버튼뿐이다(제거 버튼은 형제 `u-button`).
    // 미리보기는 `url` 이 있고 `type` 이 `image/*`·`video/*` 일 때만 열린다.
    html: '<u-file-block name="a.gif" type="image/gif" size="1024" ' +
      'url="data:image/gif;base64,R0lGODlhAQABAAAAACw="></u-file-block>',
    prepare: async (host) => {
      (host.shadowRoot!.querySelector('.card') as HTMLElement).click();
      await (host as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
      // 열림 애니메이션(`preview-fadeIn`)은 opacity 만 바꿔 치수에 영향이 없다 — 기다리지 않는다.
    },
    targets: () => inShadow(document.querySelector('u-file-block')!, '.preview-close'),
  },
};

async function mount(html: string, settle = 0): Promise<void> {
  document.body.innerHTML = `<div style="padding:40px;width:600px">${html}</div>`;
  await new Promise((r) => setTimeout(r, 80 + settle));
}

/**
 * 두 엔트리가 등록한 태그 중 **이 패키지가 소유한 것**만 — 손으로 열거하지 않는다.
 *
 * 🔴**형제 `@iyulab/components` 의 태그를 걸러야 한다.** 우리 배럴을 임포트하면 그쪽 컴포넌트
 * (`u-button`·`u-icon`·`u-copy-button` 등 실측 8개)도 부수효과로 함께 등록되는데, 그것들은
 * ***그 패키지의 계약이고 거기 같은 게이트가 이미 있다.*** 여기서 또 재면 ⑴판정이 두 곳으로
 * 갈려 드리프트하고 ⑵우리가 고칠 수 없는 미달이 이 스위트를 빨갛게 만든다.
 *
 * ⚠**그 목록을 손으로 쓰지 않는다** — 형제를 «먼저» 임포트해 그때 등록된 것을 걷어내면,
 * 남는 것이 곧 우리 것이다(같은 태그는 두 번 등록되지 않는다). 형제가 컴포넌트를 더하거나
 * 빼도 이 판정은 따라온다.
 */
const registered: string[] = [];

beforeAll(async () => {
  const original = customElements.define.bind(customElements);
  customElements.define = ((name: string, ctor: CustomElementConstructor, opts?: ElementDefinitionOptions) => {
    registered.push(name);
    return original(name, ctor, opts);
  }) as typeof customElements.define;

  await import('@iyulab/components');
  const foreign = registered.length;
  registered.length = 0;

  await import('../../src/index.js');
  await import('../../src/extra.js');
  customElements.define = original;

  // 형제가 실제로 무언가를 등록했는지 확인한다 — 0 이면 위 «걸러내기»가 아무 일도 하지 않은
  // 것이고, 그러면 아래 분류표에 남의 태그가 섞여 들어와도 알 방법이 없다.
  if (foreign === 0) throw new Error('형제 배럴이 아무 태그도 등록하지 않았다 — 소유 판정이 무의미하다');
});

describe('WCAG 2.2 SC 2.5.8 — 타깃 크기(최소) 게이트', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('규칙 자체 — 간격 예외 모델링', () => {
    it('24×24 이상이면 간격과 무관하게 통과한다', () => {
      expect(judge({ w: 24, h: 24, cx: 0, cy: 0 }, [{ w: 24, h: 24, cx: 1, cy: 0 }])).toBe('meets-size');
    });

    it('🔴미달이어도 중심 간 24px 이상이면 «간격 예외»로 통과한다', () => {
      expect(judge({ w: 16, h: 16, cx: 0, cy: 0 }, [{ w: 16, h: 16, cx: 24, cy: 0 }]))
        .toBe('exempt-by-spacing');
    });

    it('🔴미달이고 중심 간 24px 미만이면 위반이다', () => {
      expect(judge({ w: 16, h: 16, cx: 0, cy: 0 }, [{ w: 16, h: 16, cx: 23.9, cy: 0 }]))
        .toBe('undersized');
    });

    it('⚪NEGATIVE — 이웃이 없으면 미달이어도 «간격 예외»다 (혼자 있는 타깃)', () => {
      expect(judge({ w: 10, h: 10, cx: 0, cy: 0 }, [])).toBe('exempt-by-spacing');
    });

    it('⚪NEGATIVE — 대각선 거리도 유클리드로 잰다 (축별로 재면 틀린다)', () => {
      expect(judge({ w: 16, h: 16, cx: 0, cy: 0 }, [{ w: 16, h: 16, cx: 17, cy: 17 }]))
        .toBe('exempt-by-spacing');
    });
  });

  describe('🔴 대상 도출 — 등록된 태그가 규칙 표를 벗어나지 않는다', () => {
    it('두 엔트리가 태그를 실제로 등록한다 (도출이 0건이면 아래 단언이 전부 공허해진다)', () => {
      expect(registered.length).toBeGreaterThan(10);
    });

    it('등록된 모든 태그가 세 집합 중 정확히 하나에 분류돼 있다', () => {
      const unclassified = registered.filter(
        (t) => !NOT_A_TARGET.has(t) && !NEEDS_FIXTURE.has(t) && !(t in FIXTURES),
      );
      expect(unclassified,
        `분류되지 않은 태그가 있다 — 새 컴포넌트라면 규칙 표에 넣을 것: ${unclassified.join(' ')}`,
      ).toEqual([]);
    });

    it('📌커버리지를 보고한다 — 「미판정」은 통과가 아니다', () => {
      const unjudged = [...NEEDS_FIXTURE].sort();
      // ⚠이 단언은 «미판정이 늘지 않았는가»를 지킨다. 픽스처를 쓰면 이 수가 줄고 그때 이
      //   줄을 함께 고치는 것이 그 작업의 완료 신호다. 숫자를 문자열로 고정하는 이유는
      //   `components` 쪽과 같다 — 분류를 바꾸면 반드시 여기도 손대게 만든다.
      // 🔴«판정» 은 태그 수와 **상태 수**를 함께 말한다 — 태그만 세면 한 태그의 열린 상태를
      //   빠뜨려도 이 줄이 변하지 않는다(`u-images-block` 라이트박스가 그렇게 숨어 있었다).
      const states = Object.values(FIXTURES).flat().length;
      expect(
        `판정 ${Object.keys(FIXTURES).length}(${states}상태) · 미판정 ${unjudged.length}(${unjudged.join(' ')})` +
        ` · 대상아님 ${NOT_A_TARGET.size} · 인라인예외 ${INLINE_PROSE.size}`,
      ).toBe('판정 8(9상태) · 미판정 0() · 대상아님 8 · 인라인예외 1');
    });

    it('규칙 표에 «등록되지 않은» 이름이 남아 있지 않다 (표가 낡지 않게)', () => {
      const known = new Set(registered);
      const stale = [...NOT_A_TARGET, ...NEEDS_FIXTURE, ...Object.keys(FIXTURES)]
        .filter((t) => !known.has(t));
      expect(stale, `등록되지 않은 이름: ${stale.join(' ')}`).toEqual([]);
    });
  });

  describe('실측 — 픽스처를 가진 모든 타깃', () => {
    const CASES = Object.entries(FIXTURES).flatMap(([tag, entry]) =>
      (Array.isArray(entry) ? entry : [entry]).map((fixture) => ({ tag, fixture })));
    for (const { tag, fixture } of CASES) {
      const pinned = UNDERSIZED_PINS.has(tag);
      const inline = INLINE_PROSE.has(tag);
      const label = pinned
        ? '📌미달로 «핀»돼 있다 (사람 판단 대기)'
        : inline
          ? '「인라인」 예외 — 크기 하한을 적용하지 않되 실측은 보고한다'
          : 'SC 2.5.8 을 만족한다';
      it(`${tag}${fixture.state ? ` [${fixture.state}]` : ''}: ${label}`, async () => {
        await mount(fixture.html, fixture.settle);
        if (fixture.prepare) await fixture.prepare(document.querySelector(tag)!);
        const targets = (fixture.targets ? fixture.targets(tag) : [document.querySelector(tag)!])
          .map(measure);
        expect(targets.length, '타깃을 하나도 못 찾으면 이 판정은 무의미하다').toBeGreaterThan(0);

        const verdicts = targets.map((t, i) =>
          fixture.spacingIsOurs ? judge(t, targets.filter((_, j) => j !== i)) : judge(t, [t]),
        );
        const detail = `실측 ${targets.map((t) => `${Math.round(t.w)}x${Math.round(t.h)}`).join(' ')} · 판정 ${verdicts.join(' ')}`;

        if (pinned) {
          expect(verdicts.some((v) => v === 'undersized'), detail).toBe(true);
        } else if (inline) {
          /* 크기 하한은 적용하지 않는다. 대신 **예외의 전제**를 잰다 — 이 컴포넌트가 실제로
             문장 안을 «인라인으로 흐르는가». 블록이 되면 더 이상 문장 안의 타깃이 아니고
             면제 근거가 사라진다 ⇒ 면제가 조용히 넓어지는 것을 막는 자리다.
             ⚠재는 것은 **호스트**다 — 섀도 안쪽 `a` 는 `display: block` 이어도 무방하다
             (문장의 흐름을 정하는 것은 호스트의 display 다). */
          const host = document.querySelector(tag)!;
          expect(getComputedStyle(host).display, `${detail} · 인라인이 아니면 면제 근거가 없다`)
            .toMatch(/^inline/);
        } else {
          expect(verdicts.every((v) => v !== 'undersized'), detail).toBe(true);
        }
      });
    }
  });
});
