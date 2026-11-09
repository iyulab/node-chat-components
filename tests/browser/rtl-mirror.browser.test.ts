import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/blocks/UTableBlock.js';
import '../../src/components/blocks/UFileBlock.js';
import type { UTableBlock, TableCell } from '../../src/components/blocks/UTableBlock.js';

/**
 * 「`dir="rtl"` 에서 배치가 **거울**인가」 — 한 호스트를 LTR 과 RTL 로 두 번 그려, 안쪽 모든 상자(섀도 트리 · 슬롯된 자식)와 글자(범위 상자)가
 * 호스트 가운데를 축으로 좌우 대칭인지 잰다: RTL 의 [왼쪽, 오른쪽] 이 LTR 의 [W − 오른쪽, W − 왼쪽]. 호스트 폭을 고정하므로 두 방향의 W 가 같다.
 *
 * ⚠**대상 목록은 손으로 쓴다**(`modern-app` · `components` 의 같은 이름 시험과 같다 — 패키지마다 사본이다). 작성자가 마크다운 열 표시로 지정한
 * 정렬(`align="left"|"right"`)은 **물리 방향이 의미**라 그대로 두고 이 시험의 대상이 아니다 — `align` 이 없는 기본 정렬만 잰다.
 */

const cell = (text: string): TableCell => ({ align: null, text }) as TableCell;

const FIXTURES: Array<[string, () => HTMLElement]> = [
  ['u-table-block (기본 정렬)', () => {
    const el = document.createElement('u-table-block') as UTableBlock;
    el.id = 'h';
    el.headers = [cell('Name'), cell('Status')];
    el.rows = [[cell('Alpha'), cell('Open')], [cell('Beta'), cell('Done')]];
    return el;
  }],
  ['u-file-block (제거 가능)', () => {
    const el = document.createElement('u-file-block') as HTMLElement & { removable: boolean; name: string; type: string; size: number };
    el.id = 'h';
    el.removable = true;
    el.name = 'report.pdf';
    el.type = 'application/pdf';
    el.size = 20480;
    return el;
  }],
];

interface Box { key: string; l: number; r: number }

async function settle(): Promise<void> {
  const all = Array.from(document.body.querySelectorAll('*')) as (HTMLElement & { updateComplete?: Promise<unknown> })[];
  for (const el of all) if (el.updateComplete) await el.updateComplete;
  await new Promise((r) => setTimeout(r, 150));
}

function snapshot(host: HTMLElement): { width: number; boxes: Box[] } {
  const H = host.getBoundingClientRect();
  const boxes: Box[] = [];
  let n = 0;
  const visit = (root: Element | ShadowRoot, prefix: string) => {
    for (const el of Array.from(root.querySelectorAll('*'))) {
      // A glyph's own paths are not symmetric on purpose (only a directional icon would be flipped); the icon's box is measured.
      if (el.closest('svg') && el.localName !== 'svg') continue;
      const id = `${prefix}${n++}:${el.localName}`;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) boxes.push({ key: id, l: rect.left - H.left, r: rect.right - H.left });
      const hasText = Array.from(el.childNodes).some((c) => c.nodeType === Node.TEXT_NODE && c.textContent!.trim());
      if (hasText) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const tr = range.getBoundingClientRect();
        if (tr.width > 0) boxes.push({ key: `${id}#text`, l: tr.left - H.left, r: tr.right - H.left });
      }
      if (el.shadowRoot) visit(el.shadowRoot, `${id}/`);
    }
  };
  if (host.shadowRoot) visit(host.shadowRoot, 's:');
  visit(host, 'l:');
  return { width: H.width, boxes };
}

async function render(dir: 'ltr' | 'rtl', make: () => HTMLElement): Promise<HTMLElement> {
  document.documentElement.dir = dir;
  document.body.innerHTML = '<div id="frame" style="width: 600px"></div>';
  const host = make();
  document.getElementById('frame')!.appendChild(host);
  await settle();
  return host;
}

afterEach(() => { document.documentElement.dir = 'ltr'; document.body.innerHTML = ''; });

describe('RTL — 일반 거울 오라클', () => {
  it.each(FIXTURES)('%s 는 RTL 에서 좌우가 대칭이다', async (_name, make) => {
    const ltr = snapshot(await render('ltr', make));
    const rtl = snapshot(await render('rtl', make));
    expect(rtl.boxes.map((b) => b.key), '두 방향의 상자 구성이 같다').toEqual(ltr.boxes.map((b) => b.key));
    expect(Math.abs(rtl.width - ltr.width)).toBeLessThanOrEqual(1);
    const bad: string[] = [];
    ltr.boxes.forEach((a, i) => {
      const b = rtl.boxes[i];
      const dl = Math.abs(b.l - (ltr.width - a.r));
      const dr = Math.abs(b.r - (ltr.width - a.l));
      if (dl > 1.5 || dr > 1.5) bad.push(`${a.key}: LTR [${a.l.toFixed(0)}, ${a.r.toFixed(0)}] → RTL [${b.l.toFixed(0)}, ${b.r.toFixed(0)}] (기대 [${(ltr.width - a.r).toFixed(0)}, ${(ltr.width - a.l).toFixed(0)}])`);
    });
    expect(bad, `거울이 아닌 상자 ${bad.length}개`).toEqual([]);
  });
});
