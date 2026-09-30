import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/prompt/UPrompt.js';

/**
 * 채팅 입력에서 IME 조합(한국어 등)을 확정하는 Enter 는 전송이 아니다 — 전송하면 마지막 음절이
 * 조합이 끝난 뒤 한 번 더 들어가 두 번 보내진다. `isComposing` 과 Safari 의 `keyCode: 229` 를 둘 다 잰다.
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

  it.each([
    ['isComposing', { isComposing: true }],
    ['keyCode 229(Safari)', { keyCode: 229 }],
  ])('%s', async (_n, init) => {
    const { block, sends } = await prompt();
    block.dispatchEvent(key(init));
    expect(sends).toHaveLength(0);
  });

  it('대조군 — 보통 Enter 는 전송한다', async () => {
    const { block, sends } = await prompt();
    block.dispatchEvent(key({ keyCode: 13 }));
    expect(sends).toHaveLength(1);
  });
});
