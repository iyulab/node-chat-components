import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/blocks/UTableBlock.js';

/**
 * 내려받기(XLS · CSV)는 표의 보조 동작이다. 채운 주색이면 표 데이터보다 먼저 눈에 들어와 위계가 뒤집힌다.
 * 그래서 테두리만 있는 무채색이고, 검색 칸과 한 줄 높이다.
 */
type Btn = HTMLElement & { updateComplete: Promise<boolean> };

async function mount(): Promise<HTMLElement> {
  const el = document.createElement('u-table-block') as HTMLElement & {
    headers: unknown[]; rows: unknown[]; updateComplete: Promise<boolean>;
  };
  el.headers = [{ text: '이름', align: null }, { text: '값', align: null }];
  el.rows = [['가', '1'], ['나', '2']];
  document.body.appendChild(el);
  await el.updateComplete;
  for (const b of el.shadowRoot!.querySelectorAll<Btn>('.toolbar-right u-button')) await b.updateComplete;
  return el;
}

const transparent = (c: string) => c === 'transparent' || /rgba\(.*,\s*0\)$/.test(c);

describe('u-table-block — 툴바 내려받기 단추', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('채우지 않는다 — 배경이 투명하고 테두리가 있다', async () => {
    const el = await mount();
    const buttons = [...el.shadowRoot!.querySelectorAll<HTMLElement>('.toolbar-right u-button')];
    expect(buttons.length).toBe(2);
    for (const b of buttons) {
      // 채움은 호스트 상자에, 테두리는 안쪽 버튼에 그려진다(u-button 의 appearance 규칙)
      const host = getComputedStyle(b);
      expect(transparent(host.backgroundColor), host.backgroundColor).toBe(true);
      const box = getComputedStyle(b.shadowRoot!.querySelector('[part="button"]')!);
      expect(transparent(box.borderTopColor), box.borderTopColor).toBe(false);
    }
  });

  it('검색 칸보다 높지 않다 — 툴바가 한 줄 높이를 지킨다', async () => {
    const el = await mount();
    const search = el.shadowRoot!.querySelector('.toolbar-search') as HTMLElement;
    const searchH = search.getBoundingClientRect().height;
    for (const b of el.shadowRoot!.querySelectorAll<HTMLElement>('.toolbar-right u-button')) {
      expect(b.getBoundingClientRect().height).toBeLessThanOrEqual(searchH + 1);
    }
  });
});
