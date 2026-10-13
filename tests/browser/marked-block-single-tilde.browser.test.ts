import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';

/**
 * 물결 하나(`~`)는 취소선이 아니다 — 물결 둘(`~~`)만 취소선이다.
 *
 * GFM 은 `~a~` 도 취소선으로 읽고 marked 는 그대로 구현한다. 그런데 이 컴포넌트가 그리는 글(모델 답변)에서
 * 물결 하나는 거의 언제나 **범위 표기**다 — «10~20명», «3~5일», «~5 min». 한 문단에 범위가 둘 있으면 그 사이
 * 글자 전체에 줄이 그어지고 물결 두 개가 사라져 «1020명 … 35일» 로 읽혔다.
 */
describe('u-marked-block — 물결 하나는 글자로 남는다', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  async function render(value: string): Promise<UMarkedBlock> {
    const el = document.createElement('u-marked-block') as UMarkedBlock;
    el.value = value;
    document.body.appendChild(el);
    await settle(el);
    return el;
  }

  /** willUpdate 의 지연 큐잉이 끝난 최종 렌더까지 기다린다. */
  async function settle(el: UMarkedBlock): Promise<void> {
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 120));
    await el.updateComplete;
  }

  const dels = (el: UMarkedBlock) => Array.from(el.shadowRoot!.querySelectorAll('del'));
  const text = (el: UMarkedBlock) => (el.shadowRoot!.textContent ?? '').replace(/\s+/g, ' ').trim();

  it.each([
    '참가 인원 10~20명, 기간 3~5일',
    '15~29세 - 30~39세',
    '2023년 1월~3월, 4월~6월',
    '약 3~4배 (전년 대비 10~15% 증가)',
    '가격은 1~2만원입니다',
    'A ~ B 그리고 C ~ D',
    'Takes ~5 min, sometimes ~10 min',
  ])('범위 표기 «%s» 는 그대로 보인다', async (input) => {
    const el = await render(input);
    expect(dels(el)).toHaveLength(0);
    expect(text(el)).toBe(input);
  });

  it('GFM 의 물결 하나 취소선(`~a~`)도 글자로 남는다', async () => {
    const el = await render('이것은 ~취소~ 가 아니다');
    expect(dels(el)).toHaveLength(0);
    expect(text(el)).toBe('이것은 ~취소~ 가 아니다');
  });

  it('물결 둘은 취소선이다 — 같은 문단의 범위 물결은 남는다', async () => {
    const el = await render('기간 3~5일, ~~취소된 일정~~ 그리고 10~20명');
    expect(dels(el).map((d) => d.textContent)).toEqual(['취소된 일정']);
    expect(text(el)).toBe('기간 3~5일, 취소된 일정 그리고 10~20명');
  });

  it('표 칸 안의 범위 표기도 그대로 보인다', async () => {
    const el = await render('| 항목 | 값 |\n|---|---|\n| 인원 | 10~20명, 3~5일 |\n| 상태 | ~~폐기~~ |\n');
    await (el.shadowRoot!.querySelector('u-table-block') as HTMLElement & { updateComplete?: Promise<unknown> })
      ?.updateComplete;
    const table = el.shadowRoot!.querySelector('u-table-block')!;
    const root = table.shadowRoot ?? table;
    const cells = Array.from(root.querySelectorAll('td')).map((td) => td.textContent?.trim());
    expect(cells).toContain('10~20명, 3~5일');
    expect(root.querySelectorAll('td del')).toHaveLength(1);
  });

  it('코드 조각 안의 물결은 손대지 않는다', async () => {
    const el = await render('경로 `~/a~b~` 와 3~5일');
    expect(dels(el)).toHaveLength(0);
    expect(el.shadowRoot!.querySelector('code')?.textContent).toBe('~/a~b~');
  });

  it('스트리밍 중 닫히지 않은 물결 둘은 취소선이 아니고, 닫히면 취소선이 된다', async () => {
    const el = await render('기간 3~5일, ~~취소');
    expect(dels(el)).toHaveLength(0);
    expect(text(el)).toBe('기간 3~5일, ~~취소');

    el.value = '기간 3~5일, ~~취소~~ 10~20명';
    await settle(el);
    expect(dels(el).map((d) => d.textContent)).toEqual(['취소']);
    expect(text(el)).toBe('기간 3~5일, 취소 10~20명');
  });
});
