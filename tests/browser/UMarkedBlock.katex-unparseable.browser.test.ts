import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';

/**
 * **TeX 로 읽을 수 없는 `$…$` 는 글자로 남는다.**
 *
 * 첫 `$` 에서 «뒤에 공백·구두점이 오는 다음 `$`» 까지가 한 구간으로 잡히므로, 본문에 `$` 가 둘 있으면 그 사이의 문장이
 * 통째로 수식 후보가 된다(`Word lock files (~$) show … 5 USD$ today` 의 `~$` 가 그 예). KaTeX 가 그 구간을 못 읽으면
 * 종전에는 두 갈래로 깨졌다: 전체 파싱(`silent`)이 답 전체를 «An error occurred» 문장으로 바꾸거나, 블록별 렌더가
 * `ParseError` 를 `render()` 밖으로 던졌다. 이 파일은 «수식이 아닌 것을 수식으로 만들지 않는다» 의 마지막 축 —
 * 못 읽는 구간은 수식이 아니다 — 을 고정한다.
 */
describe('UMarkedBlock — 못 읽는 수식 구간은 글자로 남는다', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  async function render(value: string): Promise<UMarkedBlock> {
    const el = document.createElement('u-marked-block') as UMarkedBlock;
    el.value = value;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 120));
    await el.updateComplete;
    return el;
  }

  const text = (el: UMarkedBlock) => el.shadowRoot!.textContent ?? '';
  const maths = (el: UMarkedBlock) => Array.from(el.shadowRoot!.querySelectorAll('math'));

  it('🔴`(~$)` 가 낀 문장이 답 전체를 오류 문장으로 바꾸지 않는다', async () => {
    const sentence =
      'Pay $5 now. Word lock files (~$) show the document is open, and the total is 5 USD$ today.';
    const el = await render(sentence);
    expect(text(el), '오류 문장이 답을 대신한다').not.toContain('An error occurred');
    expect(text(el)).not.toContain('KaTeX');
    expect(text(el), '답 본문이 그대로 보여야 한다').toContain('Word lock files (~$) show the document is open');
    expect(maths(el)).toHaveLength(0);
  });

  it('같은 모양의 한국어 문장도 같다', async () => {
    const el = await render('요금은 $5 입니다. 임시파일(~$)로 보아 열려 있고, 합계는 5달러$ 입니다.');
    expect(text(el)).not.toContain('An error occurred');
    expect(text(el)).toContain('임시파일(~$)로 보아 열려 있고');
    expect(maths(el)).toHaveLength(0);
  });

  it('읽을 수 있는 수식은 그대로 그리고, 옆의 못 읽는 구간만 글자로 남긴다', async () => {
    const el = await render(['값은 $x^2$ 이고', '', '이건 $' + String.raw`\notamacro{1}` + '$ 입니다.'].join('\n'));
    const m = maths(el);
    expect(m, '읽을 수 있는 쪽은 수식').toHaveLength(1);
    expect(m[0].querySelector('annotation')?.textContent).toBe('x^2');
    expect(text(el), '못 읽는 쪽은 글자').toContain(String.raw`$\notamacro{1}$`);
    expect(text(el)).not.toContain('An error occurred');
  });

  it('자기 줄에 선 `$$` 블록도 못 읽으면 글자로 남는다', async () => {
    const el = await render(['앞 문장', '', '$$', String.raw`\notamacro{1}`, '$$', '', '뒤 문장'].join('\n'));
    expect(text(el)).not.toContain('An error occurred');
    expect(text(el)).toContain('앞 문장');
    expect(text(el)).toContain('뒤 문장');
    expect(text(el)).toContain(String.raw`\notamacro{1}`);
    expect(maths(el)).toHaveLength(0);
  });

  it('🔴스트리밍 중 못 읽는 구간이 `render()` 밖으로 오류를 던지지 않는다', async () => {
    const errors: unknown[] = [];
    const onError = (e: ErrorEvent) => errors.push(e.error ?? e.message);
    const onRejection = (e: PromiseRejectionEvent) => errors.push(e.reason);
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    try {
      const full = 'Pay $5 now. Lock files (~$) mean the file is open; total 5 USD$ today. And $' + String.raw`\notamacro{1}` + '$ end.';
      const el = document.createElement('u-marked-block') as UMarkedBlock;
      document.body.appendChild(el);
      // 한 글자씩 자라는 답 — 갱신마다 다시 그린다.
      for (let i = 1; i <= full.length; i += 3) {
        el.value = full.slice(0, i);
        await el.updateComplete;
        await new Promise((r) => setTimeout(r, 90));
        await el.updateComplete;
      }
      el.value = full;
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 120));
      await el.updateComplete;
      expect(text(el)).toContain('Lock files (~$) mean the file is open');
      expect(text(el)).not.toContain('An error occurred');
    } finally {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    }
    expect(errors, '호스트에 도달한 예외').toEqual([]);
  });
});
