import { html, nothing, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { styles } from "./UVideoBlock.styles.js";
import { registerElementBlock } from '../utilities/ElementRegistry.js';
import schema from './UVideoBlock.schema.js';
import { sanitizeHref } from '../utilities/sanitizers.js';

// 이 모듈을 import 하면 block-json 으로 렌더할 수 있다(스키마가 허용 목록이다).
registerElementBlock(schema);

/** 자막·캡션 트랙(WebVTT) 하나. */
export interface VideoTrack {
  src: string;
  /** 기본 `subtitles` */
  kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  srclang?: string;
  label?: string;
  default?: boolean;
}

/**
 * 비디오 플레이어 블록 컴포넌트
 */
@customElement('u-video-block')
export class UVideoBlock extends UElement {
  static styles = [super.styles, styles];

  /** 비디오 URL (YouTube, Vimeo, 직접 파일) */
  @property({ type: String }) src?: string;
  /** 포스터 이미지 URL */
  @property({ type: String }) poster?: string;
  /** 비디오 비율 */
  @property({ type: String }) ratio: '16:9' | '4:3' | '1:1' = '16:9';
  /**
   * 직접 파일 영상의 자막·캡션 트랙(WebVTT). 영상이 섀도 안에 그려지므로 앱이 `<track>` 을
   * 넣을 수 없다 — 이 속성이 유일한 자리다. YouTube·Vimeo 는 그 플레이어가 자막을 다룬다.
   */
  @property({ type: Array }) tracks: VideoTrack[] = [];

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('ratio')) {
      this.style.setProperty('--video-ratio', this.ratio.replace(':', ' / '));
    }
  }

  render() {
    if (!this.src) return nothing;

    // YouTube 임베드 감지
    if (this.isYouTube(this.src)) {
      const videoId = this.extractYouTubeId(this.src);
      if (videoId) {
        return html`
          <div class="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/${videoId}"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        `;
      }
    }

    // Vimeo 임베드 감지
    if (this.isVimeo(this.src)) {
      const videoId = this.extractVimeoId(this.src);
      if (videoId) {
        return html`
          <div class="video-wrapper">
            <iframe
              src="https://player.vimeo.com/video/${videoId}"
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        `;
      }
    }

    // 일반 비디오 파일
    return html`
      <video
        src=${this.src}
        poster=${ifDefined(this.poster)}
        controls
        playsinline
      >${this.tracks
        .filter((t) => t && typeof t.src === 'string' && sanitizeHref(t.src) !== '#')
        .map((t) => html`<track
          src=${sanitizeHref(t.src)}
          kind=${t.kind ?? 'subtitles'}
          srclang=${ifDefined(t.srclang)}
          label=${ifDefined(t.label)}
          ?default=${t.default === true}
        />`)}</video>
    `;
  }

  private isYouTube(url: string): boolean {
    return /youtube\.com|youtu\.be/i.test(url);
  }

  private isVimeo(url: string): boolean {
    return /vimeo\.com/i.test(url);
  }

  private extractYouTubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /youtube\.com\/embed\/([^&\s]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }

    return null;
  }

  private extractVimeoId(url: string): string | null {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-video-block": UVideoBlock;
  }
}
