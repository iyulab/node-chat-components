import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/prompt/UPrompt.js';
import '../../src/components/blocks/UFileBlock.js';

/**
 * 둥근 아이콘 버튼(`u-prompt` 의 전송 · `u-file-block` 의 제거)은 `u-button` 을 원으로 깎아 쓴다. 겉(호스트)만 줄이면
 * 안쪽 `<button>` 은 `u-button` 의 기본 여백(0.5em 1em)을 그대로 가져 원 밖으로 넘치고, 아이콘이 오른쪽 아래로 밀렸다
 * (소비자 실측: 겉 32×32 · 안 34×42). 원 안의 아이콘은 가운데다.
 */
const made: HTMLElement[] = [];
afterEach(() => { while (made.length) made.pop()!.remove(); });

async function mount(html: string) {
  const host = document.createElement('div');
  host.style.cssText = 'padding: 24px; width: 480px;';
  host.innerHTML = html;
  document.body.appendChild(host);
  made.push(host);
  const el = host.firstElementChild as HTMLElement & { updateComplete: Promise<unknown> };
  await el.updateComplete;
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  return el;
}

function expectRound(button: HTMLElement) {
  const outer = button.getBoundingClientRect();
  const inner = button.shadowRoot!.querySelector('button')!.getBoundingClientRect();
  const icon = button.querySelector('u-icon')!.getBoundingClientRect();
  expect(Math.round(inner.width)).toBeLessThanOrEqual(Math.round(outer.width));
  expect(Math.round(inner.height)).toBeLessThanOrEqual(Math.round(outer.height));
  const dx = icon.left + icon.width / 2 - (outer.left + outer.width / 2);
  const dy = icon.top + icon.height / 2 - (outer.top + outer.height / 2);
  expect(Math.abs(dx)).toBeLessThanOrEqual(1);
  expect(Math.abs(dy)).toBeLessThanOrEqual(1);
}

describe('round icon buttons keep the icon in the middle', () => {
  it('🔴u-prompt send button', async () => {
    const el = await mount('<u-prompt></u-prompt>');
    expectRound(el.shadowRoot!.querySelector<HTMLElement>('.send-btn')!);
  });

  it('🔴u-file-block remove button', async () => {
    const el = await mount('<u-file-block removable name="report.pdf" type="application/pdf" size="1024"></u-file-block>');
    const btn = el.shadowRoot!.querySelector<HTMLElement>('.remove-btn')!;
    btn.style.opacity = '1';
    expectRound(btn);
  });
});
