import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import '../../src/components/blocks/UMarkedBlock.js';
import '../../src/components/references/URefTag.js';
import '../../src/components/references/URefCard.js';
import '../../src/components-extra/UMapBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';
import type { LinkActivateEvent } from '../../src/events/LinkActivateEvent.js';
import { Locale } from '@iyulab/components/dist/utilities/Locale.js';

/**
 * 렌더된 링크의 활성화는 그 블록을 품은 앱이 정한다.
 *
 * 블록이 그리는 링크는 대개 모델 출력에서 오고, 모델은 외부인이 닿는 내용을 읽는다 — 주입된 링크 하나가 누름 한 번으로
 * 호스트 페이지(데스크톱 셸이면 그 창과 브리지까지)를 넘겨 버렸다. 그래서 ⑴ 마크다운 링크의 기본은 새 탭이고(조각 링크만
 * 제자리) ⑵ 사람이 링크를 누르면 호스트에서 취소 가능한 `link-activate` 가 난다 — 앱이 막으면 브라우저 이동도 막힌다.
 *
 * 판정은 «실제 누름» 으로 한다(클릭 · 가운데 클릭 · Enter). 시험 문서가 새 탭을 열지 않도록 창 수준에서 마지막에 막되,
 * 그 전에 «블록이 기본 동작을 막았는가» 를 기록한다.
 */
let activations: LinkActivateEvent[] = [];
let reachedWindow: Array<{ type: string; prevented: boolean }> = [];
let refuse = false;

const onActivate = (e: Event) => {
  activations.push(e as LinkActivateEvent);
  if (refuse) e.preventDefault();
};
const onClick = (e: Event) => {
  if (!e.composedPath().some((n) => n instanceof HTMLAnchorElement)) return;
  reachedWindow.push({ type: e.type, prevented: e.defaultPrevented });
  e.preventDefault();
};

beforeEach(() => {
  document.body.innerHTML = '';
  Locale.set('en');
  activations = [];
  reachedWindow = [];
  refuse = false;
  document.addEventListener('link-activate', onActivate);
  window.addEventListener('click', onClick);
  window.addEventListener('auxclick', onClick);
});
afterEach(() => {
  document.removeEventListener('link-activate', onActivate);
  window.removeEventListener('click', onClick);
  window.removeEventListener('auxclick', onClick);
});

/**
 * 시험 무대 — 여백을 둔 상자. 프레임 왼쪽 위 모서리(0,0 근처)의 작은 링크는 러너의 누름이 닿지 않고 조용히 끝났다
 * (mousedown 0건 · 링크 상자 0,1 · 21×21 실측). 컴포넌트가 아니라 시험 기하의 문제라 무대로 비켜 둔다.
 */
function stage(): HTMLElement {
  const box = document.createElement('div');
  box.style.padding = '48px';
  document.body.appendChild(box);
  return box;
}

async function markdown(value: string): Promise<UMarkedBlock> {
  const el = document.createElement('u-marked-block') as UMarkedBlock;
  el.value = value;
  stage().appendChild(el);
  await el.updateComplete;
  // willUpdate 의 지연 큐잉이 흘러야 최종 렌더를 본다.
  await new Promise((r) => setTimeout(r, 120));
  await el.updateComplete;
  return el;
}

const anchors = (el: Element) => [...el.shadowRoot!.querySelectorAll('a')];

describe('마크다운 링크의 기본 동작', () => {
  it('바깥 주소는 새 탭(opener·referrer 없이) · 조각은 제자리 · 막힌 프로토콜도 제자리', async () => {
    const el = await markdown('[ext](https://example.com/a) [frag](#sec) [bad](javascript:alert(1))');
    const [ext, frag, bad] = anchors(el);
    expect(ext.getAttribute('target')).toBe('_blank');
    expect(ext.getAttribute('rel')).toBe('noopener noreferrer');
    expect(frag.hasAttribute('target')).toBe(false);
    expect(bad.getAttribute('href')).toBe('#');
    expect(bad.hasAttribute('target')).toBe(false);
  });

  it('새 탭 링크는 접근성 이름에 그 사실을 싣고, 화면에는 그리지 않는다', async () => {
    await markdown('[Docs](https://example.com/docs)');
    const link = page.getByRole('link', { name: 'Docs (opens in a new tab)', exact: true });
    await expect.element(link).toBeInTheDocument();
    const hint = link.element().querySelector('.new-tab-hint') as HTMLElement;
    const r = hint.getBoundingClientRect();
    expect(r.width <= 1 && r.height <= 1).toBe(true);
    // 숨김 알림의 포함 블록은 링크다 — 문서까지 새지 않는다.
    expect(hint.offsetParent).toBe(link.element());
  });

  it('표 셀 링크의 알림은 셀 글자(검색·정렬·내려받기)에 들지 않는다', async () => {
    const el = await markdown('| site |\n| --- |\n| [Docs](https://example.com/docs) |');
    const table = el.shadowRoot!.querySelector('u-table-block') as HTMLElement & { rows: Array<Array<{ text: string }>> };
    expect(table).not.toBeNull();
    expect(table.rows[0][0].text).toBe('Docs');
    await expect.element(page.getByRole('link', { name: 'Docs (opens in a new tab)', exact: true })).toBeInTheDocument();
  });
});

describe('link-activate', () => {
  it('클릭하면 호스트에서 한 번 난다 — 절대 주소와 누름을 싣고, 막지 않으면 기본 동작대로', async () => {
    await markdown('see [ext](https://example.com/a)');
    await userEvent.click(page.getByRole('link', { name: /^ext/ }));
    expect(activations).toHaveLength(1);
    expect(activations[0].detail.href).toBe('https://example.com/a');
    expect(activations[0].detail.originalEvent.type).toBe('click');
    expect(activations[0].cancelable).toBe(true);
    expect(reachedWindow).toEqual([{ type: 'click', prevented: false }]);
  });

  it('앱이 막으면 브라우저 이동도 막힌다', async () => {
    refuse = true;
    await markdown('[ext](https://example.com/a)');
    await userEvent.click(page.getByRole('link', { name: /^ext/ }));
    expect(activations).toHaveLength(1);
    expect(reachedWindow).toEqual([{ type: 'click', prevented: true }]);
  });

  it('키보드(Enter)로 따라가도 같은 길을 지난다', async () => {
    refuse = true;
    const el = await markdown('[ext](https://example.com/a)');
    anchors(el)[0].focus();
    await userEvent.keyboard('{Enter}');
    expect(activations).toHaveLength(1);
    expect(reachedWindow.at(-1)).toEqual({ type: 'click', prevented: true });
  });

  it('가운데 클릭(새 탭 열기)도 묻는다', async () => {
    refuse = true;
    await markdown('[ext](https://example.com/a)');
    await userEvent.click(page.getByRole('link', { name: /^ext/ }), { button: 'middle' });
    expect(activations).toHaveLength(1);
    expect(activations[0].detail.originalEvent.button).toBe(1);
    expect(reachedWindow.at(-1)).toEqual({ type: 'auxclick', prevented: true });
  });

  it('표 블록이 마크다운 안에 겹쳐도 한 번의 누름에 이벤트는 하나다', async () => {
    // 막지 않는 경우로 잰다 — 막으면 바깥 블록은 `defaultPrevented` 로 빠져 중복 방지를 재지 못한다.
    await markdown('| site |\n| --- |\n| [Docs](https://example.com/docs) |');
    await userEvent.click(page.getByRole('link', { name: /^Docs/ }));
    expect(activations).toHaveLength(1);
    expect(activations[0].detail.href).toBe('https://example.com/docs');
  });

  it('링크가 아닌 곳을 누르면 나지 않는다 — 블록을 감싼 페이지의 링크도 블록의 몫이 아니다', async () => {
    const outer = document.createElement('a');
    outer.href = 'https://example.com/outer';
    const el = document.createElement('u-marked-block') as UMarkedBlock;
    el.value = 'plain text only';
    outer.appendChild(el);
    stage().appendChild(outer);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 120));
    await userEvent.click(page.getByText('plain text only'));
    expect(activations).toHaveLength(0);
  });

  for (const [tag, markup, href] of [
    ['u-ref-tag', '<u-ref-tag href="https://example.com/t">1</u-ref-tag>', 'https://example.com/t'],
    ['u-ref-card', '<u-ref-card type="web" url="https://example.com/c" title="Doc"></u-ref-card>', 'https://example.com/c'],
    ['u-map-block', '<u-map-block lat="37.5" lng="127" label="Office"></u-map-block>', 'https://www.openstreetmap.org/'],
  ] as const) {
    it(`${tag} 의 링크도 묻는다`, async () => {
      refuse = true;
      stage().innerHTML = markup;
      const el = document.querySelector(tag) as HTMLElement & { updateComplete: Promise<unknown> };
      await el.updateComplete;
      await userEvent.click(page.getByRole('link', { name: /opens in a new tab/ }));
      expect(activations).toHaveLength(1);
      expect(activations[0].detail.href.startsWith(href)).toBe(true);
      expect(reachedWindow.at(-1)).toEqual({ type: 'click', prevented: true });
    });
  }
});
