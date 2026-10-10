import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Locale } from '@iyulab/components/dist/utilities/Locale.js';
import '../../src/components/message/UMessage.js';
import '../../src/components/blocks/UTextBlock.js';
import type { UMessage } from '../../src/components/message/UMessage.js';

/**
 * **`u-message` 의 발화자와 «생성 중» 은 의미다 — 위치만으로는 눈에만 보인다.**
 *
 * | 계약 | 재는 것 |
 * |---|---|
 * | 발화자 | `author` → 본문 앞 숨은 이름(«AI assistant:») · `author-label` 로 바꾼다 · 로캘을 따른다 |
 * | 보이는 이름 우선 | `header` 슬롯에 내용이 있으면 숨은 이름을 내지 않는다(두 번 읽히지 않게) |
 * | 생성 중 | `loading` → 본문 `aria-busy="true"` · 로더 이름 «Generating a response» · 그림은 `aria-hidden` |
 * | 화면 무변화 | 숨은 이름은 크기·간격을 만들지 않는다(같은 높이) · 넘침 클리핑을 벗어나지 않는다 |
 */

async function mount(markup: string): Promise<UMessage> {
  document.body.innerHTML = markup;
  const el = document.querySelector('u-message') as UMessage;
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
  return el;
}

const body = (el: UMessage) => el.shadowRoot!.querySelector('.body') as HTMLElement;
const hidden = (el: UMessage) => Array.from(el.shadowRoot!.querySelectorAll('.visually-hidden')).map((n) => n.textContent);

describe('u-message 발화자 · 생성 중', () => {
  beforeEach(() => { document.body.innerHTML = ''; });
  afterEach(() => { Locale.set('en'); });

  it('author 가 본문 앞 숨은 이름이 된다 — 셋 다', async () => {
    for (const [author, name] of [['assistant', 'AI assistant:'], ['user', 'You:'], ['system', 'System:']]) {
      const el = await mount(`<u-message author="${author}"><u-text-block value="Hi"></u-text-block></u-message>`);
      expect(hidden(el)).toEqual([name]);
    }
  });

  it('author-label 이 이름을 바꾸고, 로캘을 따른다', async () => {
    let el = await mount('<u-message author="assistant" author-label="Aimee"><u-text-block value="Hi"></u-text-block></u-message>');
    expect(hidden(el)).toEqual(['Aimee:']);
    Locale.set('ko');
    el = await mount('<u-message author="assistant"><u-text-block value="Hi"></u-text-block></u-message>');
    expect(hidden(el)).toEqual(['AI 어시스턴트:']);
  });

  it('header 슬롯에 보이는 이름이 있으면 숨은 이름을 내지 않는다', async () => {
    const el = await mount('<u-message author="assistant"><div slot="header">Aimee</div><u-text-block value="Hi"></u-text-block></u-message>');
    expect(hidden(el)).toEqual([]);
  });

  it('🔴NEGATIVE author 가 없으면 아무것도 더하지 않는다', async () => {
    const el = await mount('<u-message><u-text-block value="Hi"></u-text-block></u-message>');
    expect(hidden(el)).toEqual([]);
    expect(body(el).getAttribute('aria-busy')).toBe('false');
  });

  it('loading — 본문 aria-busy · 로더 이름 · 그림은 aria-hidden', async () => {
    const el = await mount('<u-message author="assistant" loading><u-text-block value="Hi"></u-text-block></u-message>');
    expect(body(el).getAttribute('aria-busy')).toBe('true');
    expect(hidden(el)).toEqual(['AI assistant:', 'Generating a response']);
    expect(el.shadowRoot!.querySelector('.dot-loader')!.getAttribute('aria-hidden')).toBe('true');
    el.loading = false;
    await el.updateComplete;
    expect(body(el).getAttribute('aria-busy')).toBe('false');
    expect(hidden(el)).toEqual(['AI assistant:']);
  });

  it('숨은 이름은 화면을 바꾸지 않는다 — 같은 높이 · 본문 안에 갇힌다', async () => {
    const plain = await mount('<u-message variant="bubble"><u-text-block value="Hi"></u-text-block></u-message>');
    const plainHeight = body(plain).getBoundingClientRect().height;
    const named = await mount('<u-message variant="bubble" author="user"><u-text-block value="Hi"></u-text-block></u-message>');
    expect(body(named).getBoundingClientRect().height).toBe(plainHeight);
    expect(getComputedStyle(body(named)).position).toBe('relative');
  });
});
