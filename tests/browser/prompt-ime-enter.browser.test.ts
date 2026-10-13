import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/prompt/UPrompt.js';
import { compose, commitWithEnter } from './ime.js';

/**
 * 채팅 입력에서 IME 조합(한국어 등)을 확정하는 Enter 는 전송이 아니다 — 전송하면 마지막 음절이
 * 조합이 끝난 뒤 한 번 더 들어가 두 번 보내진다. 조합은 Chromium 의 실제 조합(`ime.ts`)으로, Chromium 이 낼 수 없는
 * Safari 의 확정 키(`keyCode: 229`)는 합성 대역으로 잰다.
 */
type Prompt = HTMLElement & { value: string; updateComplete: Promise<unknown> };

const key = (init: KeyboardEventInit & { keyCode?: number }) => {
  const e = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true, cancelable: true, ...init });
  if (init.keyCode !== undefined) Object.defineProperty(e, 'keyCode', { value: init.keyCode });
  return e;
};

async function prompt() {
  const el = document.createElement('u-prompt') as Prompt;
  document.body.appendChild(el);
  await el.updateComplete;
  el.value = '안녕하세요';
  await el.updateComplete;
  const sends: unknown[] = [];
  el.addEventListener('send', (e) => sends.push(e));
  const block = el.shadowRoot!.querySelector('u-text-block')!;
  return { block, sends };
}

describe('u-prompt — 조합을 확정하는 Enter 로 전송하지 않는다', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('실제 조합을 Enter 로 확정 — 보내지 않고 글자는 들어간다', async () => {
    const { block, sends } = await prompt();
    const area = block.shadowRoot!.querySelector('textarea') as HTMLTextAreaElement;
    area.focus();
    area.setSelectionRange(area.value.length, area.value.length);
    await compose(['ㅇ', '요']);
    await commitWithEnter('요');
    await new Promise((r) => setTimeout(r, 50));
    expect(sends).toHaveLength(0);
    expect(area.value).toBe('안녕하세요요');
  });

  it('keyCode 229(Safari — 합성 대역)', async () => {
    const { block, sends } = await prompt();
    block.dispatchEvent(key({ keyCode: 229 }));
    expect(sends).toHaveLength(0);
  });

  it('대조군 — 보통 Enter 는 전송한다', async () => {
    const { block, sends } = await prompt();
    block.dispatchEvent(key({ keyCode: 13 }));
    expect(sends).toHaveLength(1);
  });
});
