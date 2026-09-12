import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../../src/extra.js';
import '../../src/components/message/UMessage.js';
import '../../src/components/prompt/UPrompt.js';

/**
 * **extra 블록·메시지 표면의 크기 계약**(cycle-572).
 *
 * cycle-567 이 `u-table-block` 에서 고친 것과 **같은 부류가 둘 더 있었다** — 내부 상자가
 * 호스트 제약에 참여하지 않아, 호스트를 줄이면 **잘리고 스크롤로도 도달할 수 없다.**
 *
 * | 블록 | 제약 없을 때 | 호스트에 `max-height` 를 줄 때 |
 * |---|---|---|
 * | `u-chart-block` | 내용만큼(툴바 + 차트) | 그 높이를 따르고 **차트 영역이 줄어든다** |
 * | `u-map-block` | 지도 **300px** 기본 | 그 높이를 따른다 |
 * | `u-images-block`·`u-video-block` | 종횡비가 높이를 정한다 | **따르지 않는다 — 그러나 자르지도 않는다**(의도) |
 * | `u-message` | 내용만큼 | **따르지 않는다 — 자르지도 않는다**(의도) |
 *
 * ## 왜 매체·메시지는 «따르지 않는 것» 이 맞는가
 *
 * `u-images-block`·`u-video-block` 은 높이가 **폭에서 도출**된다(`aspect-ratio`). 세로로 누르면
 * 종횡비가 깨져 매체가 왜곡되므로, 넘치더라도 **자르지 않고 넘긴다**(`:host` 가 `overflow: visible`).
 * `u-message` 도 같다 — 채팅 스트림 자체가 스크롤을 가지므로 말풍선이 자기 내용을 접으면 읽을 수 없다.
 * ⇒ ***«제약을 따르지 않는다» 와 «조용히 잘린다» 는 다르다.*** 앞의 것은 설계, 뒤의 것이 결함이다.
 * 이 파일은 그 경계를 고정한다.
 *
 * ## `u-prompt` 는 여기 없다 — 미측정이다
 *
 * `u-prompt` 는 `u-text-block` 에 `maxRows` 를 **상한**으로 넘기고 그 안이 스크롤하므로,
 * 값이 40줄이어도 자연 높이가 **72px** 이다(실측). 즉 200/120px 제약이 **발동조차 하지 않는다.**
 * 「어긋남 0」이 아니라 **미측정**이며, 더 세게 주려면 60px 대로 내려야 하고 그 크기가 실사용
 * 시나리오인지부터 물어야 한다(cycle-568 이 세운 규율).
 */

let wrap: HTMLDivElement;
beforeEach(() => {
  wrap = document.createElement('div');
  wrap.style.width = '600px';
  document.body.appendChild(wrap);
});
afterEach(() => {
  wrap.remove();
  document.body.replaceChildren();
});

const settle = async (ms = 400) => {
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  await new Promise((r) => setTimeout(r, ms));
};
const h = (el: Element) => Math.round(el.getBoundingClientRect().height);

type El = HTMLElement & { updateComplete?: Promise<unknown> };

async function mount(tag: string, setup: (el: any) => void, hostStyle = ''): Promise<El> {
  const el = document.createElement(tag) as El;
  if (hostStyle) el.setAttribute('style', hostStyle);
  setup(el);
  wrap.appendChild(el);
  if (el.updateComplete) await el.updateComplete;
  await settle();
  return el;
}

/** 섀도 안에서 호스트 아래로 삐져나온 양 — 0 이어야 «잘리거나 넘치지 않는다». */
function spillBelowHost(el: El): number {
  const bottom = el.getBoundingClientRect().bottom;
  const kids = el.shadowRoot ? [...el.shadowRoot.children] : [];
  let max = 0;
  for (const k of kids) {
    if (['STYLE', 'SLOT'].includes(k.tagName)) continue;
    const r = k.getBoundingClientRect();
    if (r.height === 0) continue;
    max = Math.max(max, r.bottom - bottom);
  }
  return Math.round(Math.max(0, max));
}

const IMG =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzg4OCIvPjwvc3ZnPg==';

const chartFixture = (el: any) => {
  el.type = 'bar';
  el.data = { labels: ['a', 'b', 'c'], datasets: [{ label: 'd', data: [1, 2, 3] }] };
};
const mapFixture = (el: any) => {
  el.lat = 37.5;
  el.lng = 127.0;
  el.label = 'L';
};

describe('extra 블록의 높이 계약', () => {
  it('🔴`u-chart-block` — 호스트 제약이 이긴다(차트 영역이 줄어든다)', async () => {
    const natural = await mount('u-chart-block', chartFixture);
    // 선행 단언 — 자연 높이가 제약을 넘지 않으면 아래 측정은 공허하다.
    expect(h(natural), '자연 높이가 120px 을 넘어야 제약이 의미를 갖는다').toBeGreaterThan(120);
    natural.remove();

    const capped = await mount('u-chart-block', chartFixture, 'max-height:120px');
    expect(h(capped), '호스트가 제약을 따른다').toBeLessThanOrEqual(121);
    expect(spillBelowHost(capped), '호스트 밖으로 잘려 나간 부분이 없다').toBeLessThanOrEqual(1);
  });

  it('🔴`u-map-block` — 호스트 제약이 이긴다(지도가 줄어든다)', async () => {
    const natural = await mount('u-map-block', mapFixture);
    expect(h(natural), '지도 기본 높이는 300px 이다').toBeGreaterThan(120);
    natural.remove();

    const capped = await mount('u-map-block', mapFixture, 'max-height:120px');
    expect(h(capped), '호스트가 제약을 따른다').toBeLessThanOrEqual(121);
    expect(spillBelowHost(capped), '호스트 밖으로 잘려 나간 부분이 없다').toBeLessThanOrEqual(1);
  });

  it('★`u-images-block` — 제약을 따르지 «않는» 것이 계약이다(종횡비 보존 · 자르지 않는다)', async () => {
    const el = await mount(
      'u-images-block',
      (e) => {
        e.items = [{ src: IMG, alt: 'a', caption: 'c1' }, { src: IMG, alt: 'b', caption: 'c2' }];
      },
      'max-height:120px',
    );
    expect(getComputedStyle(el).overflow, '자르지 않는다 — 넘치더라도 보인다').toBe('visible');
  });

  it('★`u-video-block` — 같은 이유로 제약을 따르지 않고 자르지도 않는다', async () => {
    const el = await mount('u-video-block', (e) => { e.src = '/nonexistent.mp4'; }, 'max-height:120px');
    expect(getComputedStyle(el).overflow).toBe('visible');
  });

  it('★`u-message` — 말풍선은 자기 내용을 접지 않는다(스트림이 스크롤을 갖는다)', async () => {
    const el = await mount(
      'u-message',
      (e) => {
        for (let i = 0; i < 30; i++) {
          const p = document.createElement('p');
          p.textContent = 'line ' + i + ' of message content that takes vertical room';
          e.appendChild(p);
        }
      },
      'max-height:120px',
    );
    expect(getComputedStyle(el).overflow).toBe('visible');
  });
});
