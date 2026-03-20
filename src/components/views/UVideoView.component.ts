import { html, nothing, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { styles } from "./UVideoView.styles.js";

/**
 * 비디오 플레이어 뷰 컴포넌트
 */
export class UVideoView extends UElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof UElement> = {};

  /** 비디오 URL (YouTube, Vimeo, 직접 파일) */
  @property({ type: String }) src?: string;
  /** 포스터 이미지 URL */
  @property({ type: String }) poster?: string;
  /** 비디오 비율 */
  @property({ type: String }) ratio: '16:9' | '4:3' | '1:1' = '16:9';

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
      ></video>
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
