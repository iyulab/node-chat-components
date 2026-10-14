import { describe, it, expect, afterEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../../src/components/blocks/UMarkedBlock.js';
import '../../src/components/blocks/UTextBlock.js';
import '../../src/components/blocks/UCodeBlock.js';
import '../../src/components/prompt/UPrompt.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';
import type { UTextBlock } from '../../src/components/blocks/UTextBlock.js';
import type { UCodeBlock } from '../../src/components/blocks/UCodeBlock.js';
import type { UPrompt } from '../../src/components/prompt/UPrompt.js';

/**
 * 글자 토큰 계약 — 블록과 입력이 글꼴·크기를 `--u-*` 글자 토큰에서 읽는가.
 *
 * 소비자 보고: 색은 테마를 따라오는데 글자는 16px · 박힌 글꼴 묶음 그대로였다(대화 패널만 다른 글자).
 * ⚠**사용자 정의 속성의 «값» 이 아니라 «계산된 글꼴»** 을 잰다 — 값이 오는지만 단언한 시험이 초록인 채
 * 그 값을 읽는 요소가 하나도 없던 사례가 있었다.
 */
const THEME_ID = 'type-token-probe';

function setTheme(css: string): void {
  let el = document.getElementById(THEME_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = THEME_ID;
    document.head.append(el);
  }
  el.textContent = css;
}

async function mount<T extends HTMLElement>(html: string, selector: string): Promise<T> {
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.append(wrap);
  const el = wrap.querySelector(selector) as T & { updateComplete?: Promise<unknown> };
  await el.updateComplete;
  await new Promise(r => requestAnimationFrame(() => r(null)));
  return el;
}

const family = (el: Element) => getComputedStyle(el).fontFamily;
const size = (el: Element) => getComputedStyle(el).fontSize;

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById(THEME_ID)?.remove();
});

describe('글자 토큰 — 블록이 따라온다', () => {
  it('u-marked-block 본문은 --u-font-base · --u-text-body-size, 코드는 --u-font-mono', async () => {
    setTheme(':root { --u-font-base: Georgia, serif; --u-font-mono: "Courier New", monospace; --u-text-body-size: 12px; --u-text-body-leading: 1.75; }');
    const mb = await mount<UMarkedBlock>('<u-marked-block value="본문 `code`"></u-marked-block>', 'u-marked-block');
    await new Promise(r => setTimeout(r, 50));
    const p = mb.shadowRoot!.querySelector('p')!;
    const code = mb.shadowRoot!.querySelector('code')!;
    expect(family(p)).toMatch(/^Georgia/);
    expect(size(p)).toBe('12px');
    expect(getComputedStyle(p).lineHeight).toBe('21px');
    expect(family(code)).toMatch(/^"Courier New"/);
  });

  it('u-text-block 은 --u-font-base · --u-text-body-size', async () => {
    setTheme(':root { --u-font-base: Georgia, serif; --u-text-body-size: 12px; }');
    const tb = await mount<UTextBlock>('<u-text-block value="텍스트"></u-text-block>', 'u-text-block');
    const ta = tb.shadowRoot!.querySelector('textarea')!;
    expect(family(ta)).toMatch(/^Georgia/);
    expect(size(ta)).toBe('12px');
  });

  it('u-code-block 은 머리 글자가 --u-font-base, 코드가 --u-font-mono', async () => {
    setTheme(':root { --u-font-base: Georgia, serif; --u-font-mono: "Courier New", monospace; }');
    const cb = await mount<UCodeBlock>('<u-code-block language="js" value="const a = 1;"></u-code-block>', 'u-code-block');
    await new Promise(r => setTimeout(r, 50));
    const lang = cb.shadowRoot!.querySelector('.header .lang');
    const code = cb.shadowRoot!.querySelector('.hljs')!;
    if (lang) expect(family(lang)).toMatch(/^Georgia/);
    expect(family(code)).toMatch(/^"Courier New"/);
  });

  it('NEGATIVE — 토큰 시트가 없으면 폴백(시트 값의 복제 14px · 종전 글꼴 묶음)', async () => {
    const mb = await mount<UMarkedBlock>('<u-marked-block value="본문"></u-marked-block>', 'u-marked-block');
    await new Promise(r => setTimeout(r, 50));
    const p = mb.shadowRoot!.querySelector('p')!;
    expect(size(p)).toBe('14px');
    expect(family(p)).toMatch(/^-apple-system/);
    const tb = await mount<UTextBlock>('<u-text-block value="t"></u-text-block>', 'u-text-block');
    expect(family(tb.shadowRoot!.querySelector('textarea')!)).toMatch(/^"Segoe UI"/);
  });
});

describe('산문 줄바꿈 — 좁은 패널에서 가로로 넘치지 않는다', () => {
  const long = '서식을 어떻게 바꿀지 말해 보세요 — 이 문장은 좁은 채팅 패널의 폭보다 훨씬 길어서 접혀야 한다 '.repeat(3);
  // 자리표시 글은 상한(`maxRows` 10줄) 안에 드는 길이로 — 상한을 넘는 글은 설계대로 상한에서 멈추고 스크롤된다.
  const hint = '서식을 어떻게 바꿀지 말해 보세요 — 이 자리표시 글은 패널보다 길어 두세 줄로 접힌다';

  it('u-prompt 입력과 자리표시 글이 접힌다(가로 넘침 없음 · 높이가 는다)', async () => {
    const prompt = await mount<UPrompt>(`<div style="width: 240px"><u-prompt placeholder="${hint}"></u-prompt></div>`, 'u-prompt');
    const tb = prompt.shadowRoot!.querySelector('u-text-block') as UTextBlock;
    await tb.updateComplete;
    const ta = tb.shadowRoot!.querySelector('textarea')!;
    await new Promise(r => requestAnimationFrame(() => r(null)));
    expect(ta.scrollWidth).toBeLessThanOrEqual(ta.clientWidth + 1);
    // 비어 있을 때 칸 높이는 접힌 자리표시 글을 담는다 — 가로만 재면 둘째 줄이 세로로 잘린 것을 놓친다.
    expect(ta.scrollHeight).toBeLessThanOrEqual(ta.clientHeight + 1);
    expect(ta.clientHeight).toBeGreaterThan(parseFloat(getComputedStyle(ta).lineHeight) * 1.5);

    // 실제 입력으로 — 합성 `input` 은 InputEvent 의 API(`getTargetRanges`)를 갖지 않는다.
    await userEvent.fill(ta, long);
    await tb.updateComplete;
    await new Promise(r => requestAnimationFrame(() => r(null)));
    const pre = tb.shadowRoot!.querySelector('pre')!;
    expect(ta.scrollWidth).toBeLessThanOrEqual(ta.clientWidth + 1);
    expect(pre.getBoundingClientRect().height).toBeGreaterThan(parseFloat(getComputedStyle(pre).lineHeight) * 1.5);
  });

  it('읽기 전용 u-text-block 도 접힌다(말풍선 안 보낸 글)', async () => {
    const tb = await mount<UTextBlock>(`<div style="width: 200px"><u-text-block value="${long}"></u-text-block></div>`, 'u-text-block');
    const ta = tb.shadowRoot!.querySelector('textarea')!;
    expect(ta.scrollWidth).toBeLessThanOrEqual(ta.clientWidth + 1);
  });
});
