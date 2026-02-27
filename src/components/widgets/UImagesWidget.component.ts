import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UCarousel } from "@iyulab/components/dist/components/carousel/UCarousel.component.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { styles } from "./UImagesWidget.styles.js";

export interface ImageSlide {
  src: string;
  alt?: string;
  caption?: string;
}

/**
 * 이미지 갤러리 위젯 컴포넌트
 * u-carousel 기반 가로 슬라이드 + 슬라이딩 라이트박스
 */
export class UImagesWidget extends BaseElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-carousel': UCarousel,
    'u-icon': UIcon
  };

  /** 이미지 슬라이드 배열 */
  @property({ type: Array }) items: ImageSlide[] = [];

  @state() private _lightboxIndex: number | null = null;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeyDown);
    super.disconnectedCallback();
  }

  render() {
    if (!this.items?.length) return nothing;
    const count = this.items.length;

    return html`
      <u-carousel
        draggable
        ?navigation=${count > 2}
        ?pagination=${false}
        .slidesPerView=${Math.min(count, 3)}
        .gap=${8}
        ?loop=${false}
      >
        ${repeat(this.items, (item, i) => html`
          <div class="slide" 
            @click=${() => this.openLightBox(i)}>
            <img 
              src=${item.src} 
              alt=${item.alt || ''} 
              loading="lazy" 
            />
            <div class="caption"
              ?hidden=${!item.caption}>
              ${item.caption}
            </div>
          </div>
        `)}
      </u-carousel>

      ${this._renderLightbox()}
    `;
  }

  private _renderLightbox() {
    const idx = this._lightboxIndex;
    if (idx === null) return nothing;
    if (idx < 0 || idx >= this.items.length) return nothing;
    const item = this.items[idx];
    if (!item) return nothing;

    const total = this.items.length;

    // 트랙 위치: 현재 슬라이드(70vw)를 뷰포트 중앙에 배치
    // center = 50vw - 35vw = 15vw, 슬라이드 간격 = 70vw + 16px gap
    const translateX = `calc(15vw - ${idx} * (70vw + 16px))`;

    return html`
      <div class="lb-overlay" @click=${this.closeLightbox}>

        <div class="lb-viewport">
          <div class="lb-track" style="transform:translateX(${translateX})">
            ${repeat(this.items, (img, i) => html`
              <div class="lb-slide ${i === idx ? 'active' : ''}">
                <img src=${img.src} alt=${img.alt || ''} />
              </div>
            `)}
          </div>
        </div>

        <button class="lb-close" @click=${this.closeLightbox}>
          <u-icon lib="internal" name="x-lg"></u-icon>
        </button>

        <button class="lb-nav prev"
          ?hidden=${idx <= 0}
          @click=${(e: Event) => { e.stopPropagation(); this._prev(); }}>
          <u-icon lib="internal" name="chevron-left"></u-icon>
        </button>

        <button class="lb-nav next"
          ?hidden=${idx >= total - 1}
          @click=${(e: Event) => { e.stopPropagation(); this._next(); }}>
          <u-icon lib="internal" name="chevron-right"></u-icon>
        </button>

        <div class="lb-caption"
          ?hidden=${!item.caption}>
          ${item.caption}
        </div>
        
        <div class="lb-counter"
          ?hidden=${total <= 1}>
          ${idx + 1} / ${total}
        </div>
      </div>
    `;
  }

  private openLightBox = (i: number) => { 
    this._lightboxIndex = i; 
  }

  private closeLightbox = () => { 
    this._lightboxIndex = null; 
  }

  private _prev() {
    if (this._lightboxIndex !== null && this._lightboxIndex > 0)
      this._lightboxIndex--;
  }

  private _next() {
    if (this._lightboxIndex !== null && this._lightboxIndex < this.items.length - 1)
      this._lightboxIndex++;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this._lightboxIndex === null) return;
    if (e.key === 'Escape') this.closeLightbox();
    else if (e.key === 'ArrowLeft') this._prev();
    else if (e.key === 'ArrowRight') this._next();
  };
}
