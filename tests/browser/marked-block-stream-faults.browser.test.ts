import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';
import type { ReferenceCitation } from '../../src/types/References.js';

/**
 * 스트림 결함 주입 — 채팅 응답은 «길게 흐르는» 것이 정상 경로다. 흐름 중간의 상태 전이
 * (빠른 연속 갱신 · 인용이 본문보다 먼저/늦게 도착 · 인용 인덱스가 마크다운 구문 안에 떨어짐)에서
 * 최종 화면이 최종 입력과 같아야 하고, 중간에 예외나 깨진 마크업이 남지 않아야 한다.
 * (분리/재부착은 `marked-block-lifecycle` 이 잰다.)
 */
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function cite(at: number, label = '[1]', url = 'https://example.com/doc'): ReferenceCitation {
  return {
    label, startIndex: at, endIndex: at,
    sources: [{ type: 'web', title: 'Doc', url }],
  } as ReferenceCitation;
}

function mount(): UMarkedBlock {
  const el = document.createElement('u-marked-block') as UMarkedBlock;
  document.body.appendChild(el);
  return el;
}

describe('u-marked-block — 스트림 결함 주입', () => {
  let errors: unknown[];
  beforeEach(() => {
    document.body.innerHTML = '';
    errors = [];
    vi.spyOn(console, 'error').mockImplementation((...a) => { errors.push(a); });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('토큰 단위로 빠르게 갱신돼도 마지막 값이 그대로 그려진다 — 표·코드 펜스가 만들어지는 도중을 지나도', async () => {
    const full = [
      '# 요약', '', '본문 **강조** 와 `코드`.', '',
      '| 항목 | 값 |', '|---|---|', '| 가 | 1 |', '| 나 | 2 |', '',
      '```ts', 'const x = 1;', '```', '', '끝 문장.',
    ].join('\n');
    const el = mount();
    for (let i = 1; i <= full.length; i += 3) {
      el.value = full.slice(0, i);
      await wait(4);
    }
    el.value = full;
    await wait(300);
    await el.updateComplete;

    const root = el.shadowRoot!;
    expect(root.querySelector('h1')?.textContent).toBe('요약');
    const table = root.querySelector('u-table-block') as HTMLElement & { rows: unknown[]; updateComplete: Promise<boolean> };
    await table.updateComplete;
    expect(table.rows.length).toBe(2);
    expect(root.querySelector('u-code-block')?.textContent).toContain('const x = 1;');
    expect(root.textContent).toContain('끝 문장.');
    expect(errors).toEqual([]);
  });

  it('스트리밍 중 인용이 갱신돼도 최종 인용이 최종 자리에 한 번씩만 그려진다', async () => {
    const text = '서울의 인구는 950만이다. 부산은 330만이다.';
    const el = mount();
    el.value = text.slice(0, 15);
    el.refs = [cite(text.indexOf('이다.') + 3)];
    await wait(40);
    el.value = text;
    el.refs = [cite(text.indexOf('이다.') + 3), cite(text.length, '[2]')];
    await wait(40);
    el.refs = [cite(text.indexOf('이다.') + 3), cite(text.length, '[2]')]; // 같은 인용을 새 배열로 다시
    await wait(300);
    await el.updateComplete;

    const tags = [...el.shadowRoot!.querySelectorAll('u-ref-tag')].map((t) => t.firstChild?.textContent?.trim());
    expect(tags).toEqual(['[1]', '[2]']);
    expect(errors).toEqual([]);
  });

  it('본문보다 앞선 인용(인덱스가 아직 도착하지 않은 텍스트)은 그 텍스트가 올 때까지 그리지 않는다', async () => {
    const text = '첫 문장. 둘째 문장.';
    const el = mount();
    el.value = '첫 문장.';
    el.refs = [cite(text.length)];            // 아직 없는 «둘째 문장.» 끝
    await wait(300);
    expect(el.shadowRoot!.querySelector('u-ref-tag')).toBeNull();

    el.value = text;
    await wait(300);
    await el.updateComplete;
    const tag = el.shadowRoot!.querySelector('u-ref-tag');
    expect(tag).not.toBeNull();
    expect(el.shadowRoot!.querySelector('p')!.textContent!.startsWith(text)).toBe(true);
  });

  it('유효하지 않은 인용 인덱스(음수·NaN)는 본문을 어지럽히지 않고 무시된다', async () => {
    const text = '가나다라마바사';
    const el = mount();
    el.value = text;
    el.refs = [cite(-3), cite(Number.NaN, '[2]')];
    await wait(300);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('u-ref-tag')).toBeNull();
    expect(el.shadowRoot!.querySelector('p')?.textContent).toBe(text);
  });

  it('인용 인덱스가 링크 주소 안에 떨어져도 링크와 마크업이 깨지지 않는다', async () => {
    const text = '자세한 내용은 [문서](https://example.com/guide) 를 보라.';
    const inUrl = text.indexOf('example') + 3;
    const el = mount();
    el.value = text;
    el.refs = [cite(inUrl)];
    await wait(300);
    await el.updateComplete;

    const a = el.shadowRoot!.querySelector('a')!;
    expect(a.getAttribute('href')).toBe('https://example.com/guide');
    expect(a.textContent).toBe('문서');
    // 링크 주소 안에 인용 태그가 섞이지 않는다.
    expect(el.shadowRoot!.querySelector('a u-ref-tag')).toBeNull();
    // 인용은 잃지 않고 링크 바로 뒤로 온다.
    expect(a.nextElementSibling?.localName).toBe('u-ref-tag');
    expect(el.shadowRoot!.textContent).toContain('를 보라.');
  });

  it('인용 인덱스가 인라인 코드 안에 떨어지면 코드는 글자 그대로고 인용은 코드 바로 뒤에 온다', async () => {
    const text = '명령은 `npm install` 이다.';
    const el = mount();
    el.value = text;
    el.refs = [cite(text.indexOf('install'))];
    await wait(300);
    await el.updateComplete;
    const code = el.shadowRoot!.querySelector('code')!;
    expect(code.textContent).toBe('npm install');
    expect(code.nextElementSibling?.localName).toBe('u-ref-tag');
  });
});
