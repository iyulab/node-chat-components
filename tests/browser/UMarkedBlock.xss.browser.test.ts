import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';

/**
 * `UMarkedBlock`이 마크다운 소스에 섞인 원시 HTML을 정화 없이 `unsafeHTML()`로
 * 렌더하던 XSS.
 * marked는 v5+에서 sanitize 옵션을 제거하고 이 판단을 소비자에게 위임한다 —
 * 이 컴포넌트가 `html`/`link`/`image` 렌더러를 오버라이드해 직접 책임진다.
 *
 * 세 개의 독립 진입점을 모두 재현한다(전부 같은 marked Renderer 설정 공유):
 * ⑴ 본문의 원시 HTML(html 토큰, 블록/인라인 공통) ⑵ `[..](href)`/`![..](src)`의
 * javascript: 등 위험 protocol ⑶ 테이블 셀(`Parser.parseInline`을 옵션 없이
 * 호출하면 marked 기본 렌더러로 되돌아가 위 두 방어를 모두 우회하던 별도 경로).
 */
describe('UMarkedBlock XSS 방어', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  async function render(value: string): Promise<UMarkedBlock> {
    const el = document.createElement('u-marked-block') as UMarkedBlock;
    el.value = value;
    document.body.appendChild(el);
    await el.updateComplete;
    // willUpdate가 80ms 지연 큐잉(queuedTimer)을 거는 스트리밍 방지 로직이 있어,
    // 그 큐가 실제로 flush되어야 최종 렌더 결과를 볼 수 있다.
    await new Promise((r) => setTimeout(r, 120));
    await el.updateComplete;
    return el;
  }

  it('본문의 raw HTML(<img onerror>, <script>)을 실행하지 않고 텍스트로 escape한다', async () => {
    const el = await render(
      'hello <img src=x onerror=alert(document.domain)> world <script>alert(1)</scr' + 'ipt>'
    );
    const root = el.shadowRoot!;
    expect(root.querySelector('img')).toBeNull();
    expect(root.querySelector('script')).toBeNull();
    expect(root.textContent).toContain('<img src=x onerror=alert(document.domain)>');
    expect(root.textContent).toContain('<script>alert(1)</script>');
  });

  it('markdown 링크의 javascript: href를 무력화한다', async () => {
    const el = await render('[click me](javascript:alert(1))');
    const link = el.shadowRoot!.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe('#');
    expect(link!.textContent).toBe('click me');
  });

  it('markdown 이미지의 javascript: src를 무력화한다 — <img> 를 만들지 않는다', async () => {
    // `src="#"` 은 무해하지 않다 — 페이지 자신을 이미지로 다시 요청한다. 막힌 이미지는 대체 텍스트로 그린다.
    const el = await render('![x](javascript:alert(1))');
    expect(el.shadowRoot!.querySelector('img')).toBeNull();
    expect(el.shadowRoot!.querySelector('.image-blocked')?.textContent).toBe('Image blocked: x');
  });

  it('autolink의 javascript: protocol을 무력화한다', async () => {
    const el = await render('<javascript:alert(1)>');
    const link = el.shadowRoot!.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe('#');
  });

  it('정상 링크/이미지는 그대로 동작한다(회귀 방지)', async () => {
    const el = await render('[visit](https://example.com "Example") ![alt](https://example.com/x.png)');
    const link = el.shadowRoot!.querySelector('a');
    const img = el.shadowRoot!.querySelector('img');
    expect(link!.getAttribute('href')).toBe('https://example.com');
    expect(link!.getAttribute('title')).toBe('Example');
    expect(img!.getAttribute('src')).toBe('https://example.com/x.png');
    expect(img!.getAttribute('alt')).toBe('alt');
  });

  it('테이블 셀 안의 raw HTML과 javascript: 링크도 무력화한다(Parser.parseInline 우회 경로)', async () => {
    const md = [
      '| a |',
      '|---|',
      '| [x](javascript:alert(1)) <img src=x onerror=alert(2)> |',
    ].join('\n');
    const el = await render(md);
    const tableBlock = el.shadowRoot!.querySelector('u-table-block');
    expect(tableBlock).not.toBeNull();
    await (tableBlock as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete;

    const cellLink = tableBlock!.shadowRoot!.querySelector('td a');
    expect(cellLink).not.toBeNull();
    expect(cellLink!.getAttribute('href')).toBe('#');
    expect(tableBlock!.shadowRoot!.querySelector('td img')).toBeNull();
    expect(tableBlock!.shadowRoot!.textContent).toContain('<img src=x onerror=alert(2)>');
  });

  it('펜스 코드블록 안의 raw HTML은 실행되지 않고 하이라이트된 텍스트로만 보인다', async () => {
    const md = ['```html', '<img src=x onerror=alert(1)>', '```'].join('\n');
    const el = await render(md);
    const codeBlock = el.shadowRoot!.querySelector('u-code-block');
    expect(codeBlock).not.toBeNull();
    await (codeBlock as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete;

    // light DOM(슬롯에 할당되는 raw 콘텐츠)에 실제 <img> 엘리먼트가 붙어서는 안 된다 —
    // 그게 붙는 순간 onerror가 파싱 시점에 이미 발화한다(값을 읽기도 전에).
    expect(codeBlock!.querySelector('img')).toBeNull();
    expect(codeBlock!.textContent).toContain('<img src=x onerror=alert(1)>');

    // 하이라이트 렌더(shadow DOM의 <pre class="hljs">)도 텍스트로만 보여야 한다.
    const pre = codeBlock!.shadowRoot!.querySelector('pre.hljs');
    expect(pre!.querySelector('img')).toBeNull();
    expect(pre!.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('일반 마크다운(볼드·코드·표)은 그대로 렌더된다(회귀 방지)', async () => {
    const el = await render('**bold** and `code` and\n\n| h |\n|---|\n| cell |');
    const root = el.shadowRoot!;
    expect(root.querySelector('strong')?.textContent).toBe('bold');
    expect(root.querySelector('code')?.textContent).toBe('code');
    expect(root.querySelector('u-table-block')).not.toBeNull();
  });
});

describe('인용 링크의 위험 프로토콜', () => {
  it('인용 카드와 태그가 refs 의 javascript: URL 을 # 로 무력화한다 — 카드는 태그와 같은 규칙을 따른다', async () => {
    document.body.innerHTML = '';
    const el = document.createElement('u-marked-block') as UMarkedBlock;
    el.value = 'hello world';
    el.refs = [{ label: '[1]', startIndex: 5, endIndex: 5, sources: [{ type: 'web', title: 'x', url: 'javascript:alert(1)' }] }] as UMarkedBlock['refs'];
    document.body.appendChild(el);
    await new Promise((r) => setTimeout(r, 400));
    const tag = el.shadowRoot!.querySelector('u-ref-tag') as HTMLElement & { updateComplete: Promise<boolean> };
    const card = tag.querySelector('u-ref-card') as HTMLElement & { updateComplete: Promise<boolean> };
    await tag.updateComplete;
    await card.updateComplete;
    expect(tag.shadowRoot!.querySelector('a')!.getAttribute('href')).toBe('#');
    expect(card.shadowRoot!.querySelector('a')!.getAttribute('href')).toBe('#');
  });

  it('직접 바인딩한 u-ref-card 의 url 도 같다 · 정상 URL 은 그대로다', async () => {
    document.body.innerHTML = '';
    const bad = document.createElement('u-ref-card') as HTMLElement & { url: string; updateComplete: Promise<boolean> };
    bad.url = ' JavaScript:alert(1)';
    const ok = document.createElement('u-ref-card') as HTMLElement & { url: string; updateComplete: Promise<boolean> };
    ok.url = 'https://example.com/a?b=1&c=2';
    document.body.append(bad, ok);
    await bad.updateComplete;
    await ok.updateComplete;
    expect(bad.shadowRoot!.querySelector('a')!.getAttribute('href')).toBe('#');
    expect(ok.shadowRoot!.querySelector('a')!.getAttribute('href')).toBe('https://example.com/a?b=1&c=2');
  });
});
