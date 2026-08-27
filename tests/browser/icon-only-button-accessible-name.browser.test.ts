import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/references/URefCardGroup.js';
import '../../src/components/references/URefCard.js';
import '../../src/components/blocks/UFileBlock.js';
import type { URefCardGroup } from '../../src/components/references/URefCardGroup.js';
import type { UFileBlock } from '../../src/components/blocks/UFileBlock.js';
import { Locale } from '@iyulab/components/dist/utilities/Locale.js';

/**
 * `u-ref-card-group`의 nav-button과 `u-file-block`의 미리보기 닫기 버튼은
 * 아이콘 전용인데 접근 가능한 이름이 아예 생성된 적이 없었다(cycle-345 실측 —
 * HD-17). 둘 다 native `<button>`이라 forwarding 문제는 없지만, `messages`
 * 네임스페이스 조회가 실제로 값을 반환해 렌더에 반영되는지 확인한다.
 */
describe('chat-components 아이콘 전용 버튼 접근 가능한 이름', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    Locale.set('en');
  });

  it('u-ref-card-group의 이전/다음 버튼이 aria-label을 갖는다', async () => {
    const group = document.createElement('u-ref-card-group') as URefCardGroup;
    for (let i = 0; i < 2; i++) {
      const card = document.createElement('u-ref-card');
      card.setAttribute('type', 'web');
      card.setAttribute('url', `https://example.com/${i}`);
      card.setAttribute('title', `Doc ${i}`);
      group.appendChild(card);
    }
    document.body.appendChild(group);
    await group.updateComplete;
    await new Promise(r => setTimeout(r, 0));
    await group.updateComplete;

    const [prev, next] = [...group.shadowRoot!.querySelectorAll('button.nav-button')];
    expect(prev.getAttribute('aria-label')).toBe('Previous reference');
    expect(next.getAttribute('aria-label')).toBe('Next reference');
  });

  it('u-file-block의 미리보기 닫기 버튼이 aria-label을 갖는다', async () => {
    const block = document.createElement('u-file-block') as UFileBlock;
    block.name = 'photo.png';
    block.type = 'image/png';
    block.url = 'https://example.com/photo.png';
    document.body.appendChild(block);
    await block.updateComplete;

    block.shadowRoot!.querySelector('.card')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await block.updateComplete;

    const closeBtn = block.shadowRoot!.querySelector('button.preview-close');
    expect(closeBtn).not.toBeNull();
    expect(closeBtn!.getAttribute('aria-label')).toBe('Close preview');
  });
});
