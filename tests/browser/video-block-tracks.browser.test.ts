import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components-extra/UVideoBlock.js';
import type { UVideoBlock } from '../../src/components-extra/UVideoBlock.js';

/**
 * 직접 파일 영상의 자막 수단(KWCAG 5.2.1 · WCAG 1.2.2). `<video>` 가 섀도 안에 있어 앱이
 * `<track>` 을 넣을 수 없다 — `tracks` 속성이 유일한 자리다. 실제 엔진의 `textTracks` 로 잰다.
 */
describe('u-video-block — 자막 트랙', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  async function mount(tracks: UVideoBlock['tracks']) {
    const el = document.createElement('u-video-block') as UVideoBlock;
    el.src = '/demo.mp4';
    el.tracks = tracks;
    document.body.appendChild(el);
    await el.updateComplete;
    return el.shadowRoot!.querySelector('video')!;
  }

  it('tracks 가 textTracks 로 도달한다 — kind 기본은 subtitles', async () => {
    const video = await mount([
      { src: '/ko.vtt', srclang: 'ko', label: '한국어', default: true },
      { src: '/en.vtt', srclang: 'en', label: 'English', kind: 'captions' },
    ]);
    expect([...video.textTracks].map((t) => [t.kind, t.language, t.label])).toEqual([
      ['subtitles', 'ko', '한국어'],
      ['captions', 'en', 'English'],
    ]);
  });

  it('차단되는 src 는 트랙이 되지 않는다', async () => {
    const video = await mount([{ src: 'javascript:alert(1)' }, { src: '/a.vtt' }]);
    expect(video.textTracks.length).toBe(1);
  });

  it('JSON 속성(block-json 경로)으로도 받는다', async () => {
    document.body.innerHTML =
      `<u-video-block src="/demo.mp4" tracks='[{"src":"/ko.vtt","srclang":"ko"}]'></u-video-block>`;
    const el = document.querySelector('u-video-block') as UVideoBlock;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('video')!.textTracks.length).toBe(1);
  });
});
