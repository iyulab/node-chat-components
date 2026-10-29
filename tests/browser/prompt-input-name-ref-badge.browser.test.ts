import { describe, it, expect, afterEach } from 'vitest';
import { Locale } from '@iyulab/components/dist/utilities/Locale.js';
import '../../src/components/prompt/UPrompt.js';
import '../../src/components/references/URefCard.js';

/**
 * ⑴ `u-prompt` 의 입력은 두 겹 섀도 안이라 바깥의 이름이 닿지 않는다 — 호스트의 `aria-label` 을 안쪽 입력으로
 *    넘기고, 없으면 «텍스트» 가 아니라 용도를 말하는 로케일 문구다.
 * ⑵ `u-ref-card` 의 유형 배지는 로케일 문구다(화면에서는 대문자로 그린다).
 */
type Lit = HTMLElement & { updateComplete: Promise<boolean> };

async function settle(el: Lit): Promise<void> {
  await el.updateComplete;
  const inner = el.shadowRoot!.querySelector('u-text-block') as Lit | null;
  await inner?.updateComplete;
}

const textareaOf = (prompt: HTMLElement) =>
  prompt.shadowRoot!.querySelector('u-text-block')!.shadowRoot!.querySelector('textarea')!;

describe('u-prompt — 입력창의 접근성 이름', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    Locale.set('en');
  });

  it('호스트에 이름이 없으면 «Message» — «Text» 가 아니다', async () => {
    Locale.set('en');
    const el = document.createElement('u-prompt') as Lit;
    document.body.appendChild(el);
    await settle(el);
    expect(textareaOf(el).getAttribute('aria-label')).toBe('Message');
  });

  it('호스트의 aria-label 이 안쪽 입력의 이름이 되고, 바뀌면 따라간다', async () => {
    const el = document.createElement('u-prompt') as Lit;
    el.setAttribute('aria-label', '질문 입력');
    document.body.appendChild(el);
    await settle(el);
    expect(textareaOf(el).getAttribute('aria-label')).toBe('질문 입력');

    el.setAttribute('aria-label', '후속 질문');
    await settle(el);
    expect(textareaOf(el).getAttribute('aria-label')).toBe('후속 질문');
  });

  it('한국어 로캘의 기본 이름은 «메시지 입력»', async () => {
    Locale.set('ko');
    const el = document.createElement('u-prompt') as Lit;
    document.body.appendChild(el);
    await settle(el);
    expect(textareaOf(el).getAttribute('aria-label')).toBe('메시지 입력');
  });
});

describe('u-ref-card — 유형 배지', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    Locale.set('en');
  });

  async function badge(type: 'web' | 'document'): Promise<HTMLElement> {
    const el = document.createElement('u-ref-card') as Lit & { type: string; title: string; url: string };
    el.type = type;
    el.title = 'Doc';
    el.url = 'https://example.com/doc';
    document.body.appendChild(el);
    await el.updateComplete;
    return el.shadowRoot!.querySelector('.badge') as HTMLElement;
  }

  it('로케일 문구로 그리고, 영어는 종전처럼 대문자로 보인다', async () => {
    Locale.set('en');
    const web = await badge('web');
    expect(web.textContent!.trim()).toBe('Web');
    expect(getComputedStyle(web).textTransform).toBe('uppercase');
    expect((await badge('document')).textContent!.trim()).toBe('Document');
  });

  it('한국어 로캘에서는 «웹» · «문서»', async () => {
    Locale.set('ko');
    expect((await badge('web')).textContent!.trim()).toBe('웹');
    expect((await badge('document')).textContent!.trim()).toBe('문서');
  });
});
