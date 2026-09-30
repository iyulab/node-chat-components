import { describe, it, expect, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import '../../src/components/references/URefTag.js';
import '../../src/components/references/URefCard.js';
import '../../src/components-extra/UMapBlock.js';
import { Locale } from '@iyulab/components/dist/utilities/Locale.js';

/**
 * 새 창으로 여는 링크는 그 사실을 미리 알려야 한다(KWCAG 7.2.1 사용자 요구에 따른 실행).
 * 화면에는 외부 링크 아이콘이 보이지만 스크린리더에는 아무 말이 없었다 — 접근성 이름 끝에
 * 로케일 문구를 붙인다. 실제 접근성 트리(플레이라이트 역할 질의 — 섀도 경계를 넘는다)로 잰다.
 */
describe('chat-components 새 창 링크의 접근성 이름', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    Locale.set('en');
  });

  async function settle(tag: string) {
    const el = document.querySelector(tag) as HTMLElement & { updateComplete: Promise<unknown> };
    await el.updateComplete;
  }

  it('u-ref-tag — 인용 번호 뒤에 새 창 알림이 붙는다', async () => {
    document.body.innerHTML = '<u-ref-tag href="https://example.com/a">1</u-ref-tag>';
    await settle('u-ref-tag');
    await expect.element(page.getByRole('link', { name: '1 (opens in a new tab)' })).toBeInTheDocument();
  });

  it('u-ref-card — 카드 제목과 함께 새 창 알림이 이름에 든다', async () => {
    document.body.innerHTML = '<u-ref-card type="web" url="https://example.com/b" title="Doc"></u-ref-card>';
    await settle('u-ref-card');
    await expect.element(page.getByRole('link', { name: /Doc.*\(opens in a new tab\)$/ })).toBeInTheDocument();
  });

  it('u-map-block — 캡션 링크에 새 창 알림이 붙는다', async () => {
    document.body.innerHTML = '<u-map-block lat="37.5" lng="127" label="Office"></u-map-block>';
    await settle('u-map-block');
    await expect.element(page.getByRole('link', { name: /^Office.*\(opens in a new tab\)$/ })).toBeInTheDocument();
  });

  it('알림은 로케일을 따른다', async () => {
    Locale.set('ko');
    document.body.innerHTML = '<u-ref-tag href="https://example.com/a">2</u-ref-tag>';
    await settle('u-ref-tag');
    await expect.element(page.getByRole('link', { name: '2 (새 창에서 열림)' })).toBeInTheDocument();
  });

  it('알림은 화면에 보이지 않는다 — 1px 로 잘린다', async () => {
    document.body.innerHTML = '<u-ref-tag href="https://example.com/a">3</u-ref-tag>';
    await settle('u-ref-tag');
    const hint = document.querySelector('u-ref-tag')!.shadowRoot!.querySelector('.new-tab-hint')!;
    const r = hint.getBoundingClientRect();
    expect(r.width <= 1 && r.height <= 1).toBe(true);
  });
});
