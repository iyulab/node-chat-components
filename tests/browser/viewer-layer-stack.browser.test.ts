import { describe, it, expect, beforeEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../../src/components/blocks/UFileBlock.js';
import '../../src/components-extra/UImagesBlock.js';
import '@iyulab/components/dist/components/dialog/UDialog.js';
import type { UFileBlock } from '../../src/components/blocks/UFileBlock.js';
import type { UImagesBlock } from '../../src/components-extra/UImagesBlock.js';
import type { UDialog } from '@iyulab/components/dist/components/dialog/UDialog.js';

/**
 * 파일 미리보기와 라이트박스는 화면을 덮는 층이다 — components 의 층 스택에 서서, Escape 한 번은
 * 가장 나중에 연 층 하나만 닫는다. 종전에는 각자 document 에서 Escape 를 받아, 대화상자 안에서 연
 * 미리보기에서 누른 Escape 한 번에 미리보기와 대화상자가 함께 닫혔다(두 리스너가 같은 키를 받았다).
 */

const settle = (ms = 120) => new Promise(r => setTimeout(r, ms));

async function openDialogWith(child: HTMLElement): Promise<UDialog> {
  const dialog = document.createElement('u-dialog') as UDialog;
  dialog.appendChild(child);
  document.body.appendChild(dialog);
  await dialog.show();
  await settle();
  return dialog;
}

describe('viewers join the layer stack', () => {
  beforeEach(async () => {
    document.body.replaceChildren();
    await settle(50);
  });

  it('a file preview opened inside a dialog closes alone on Escape', async () => {
    const block = document.createElement('u-file-block') as UFileBlock;
    block.name = 'photo.png';
    block.type = 'image/png';
    block.url = 'data:image/png;base64,iVBORw0KGgo=';
    const dialog = await openDialogWith(block);
    block.shadowRoot!.querySelector('.card-main')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await block.updateComplete;
    await settle();
    expect(block.shadowRoot!.querySelector('.preview-overlay')).not.toBeNull();

    await userEvent.keyboard('{Escape}');
    await settle();
    expect(block.shadowRoot!.querySelector('.preview-overlay')).toBeNull();
    expect(dialog.open).toBe(true);

    await userEvent.keyboard('{Escape}');
    await settle();
    expect(dialog.open).toBe(false);
  });

  it('a lightbox opened inside a dialog closes alone on Escape; arrow keys still page', async () => {
    const images = document.createElement('u-images-block') as UImagesBlock;
    images.items = [
      { src: 'data:image/png;base64,iVBORw0KGgo=', alt: 'one' },
      { src: 'data:image/png;base64,iVBORw0KGgo=', alt: 'two' },
    ];
    const dialog = await openDialogWith(images);
    await images.updateComplete;
    images.open(0);
    await images.updateComplete;
    await settle();
    expect(images.shadowRoot!.querySelector('.lb-overlay')).not.toBeNull();

    await userEvent.keyboard('{ArrowRight}');
    await images.updateComplete;
    expect((images as unknown as { index: number | null }).index).toBe(1);

    await userEvent.keyboard('{Escape}');
    await settle();
    expect(images.shadowRoot!.querySelector('.lb-overlay')).toBeNull();
    expect(dialog.open).toBe(true);
  });
});
