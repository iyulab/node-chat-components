import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import { repeat } from "lit/directives/repeat.js";

import "@iyulab/components/dist/components/carousel/UCarousel.js";
import "@iyulab/components/dist/components/icon/UIcon.js";
import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { OverlayManager } from "@iyulab/components/dist/utilities/OverlayManager.js";
import { styles } from "./UImagesBlock.styles.js";
import { messages } from "../utilities/messages.js";
import { resolveImageSource } from "../utilities/imageSources.js";
import { registerElementBlock } from '../utilities/ElementRegistry.js';
import schema from './UImagesBlock.schema.js';

// 이 모듈을 import 하면 block-json 으로 렌더할 수 있다(스키마가 허용 목록이다).
registerElementBlock(schema);

export interface ImageSlide {
  src: string;
  alt?: string;
  caption?: string;
}

/**
 * u-carousel 기반 가로 슬라이드 + 슬라이딩 라이트박스 형태의 이미지 블록입니다.
 */
@customElement('u-images-block')
export class UImagesBlock extends UElement {
  static styles = [super.styles, styles];

  /** 이미지 슬라이드 배열 */
  @property({ type: Array }) items: ImageSlide[] = [];

  /** 라이트박스에서 현재 열려있는 이미지 인덱스, null이면 라이트박스 닫힘 */
  @state() private index: number | null = null;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeyDown);
    OverlayManager.closeLayer(this);
    super.disconnectedCallback();
  }

  /** 열린 라이트박스는 층이다 — Escape 는 components 의 층 스택이 «가장 나중에 연 층 하나» 에만 준다. */
  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (!changed.has('index')) return;
    if (this.index !== null) OverlayManager.openLayer(this, () => this.close());
    else OverlayManager.closeLayer(this);
  }

  render() {
    if (!this.items?.length) return nothing;
    const count = this.items.length;

    return html`
      <u-carousel
        .loop=${false}
        .navigation=${false}
        .pagination=${true}
        .draggable=${true}
        .slidesPerView=${Math.min(count, 3)}
        .gap=${8}
      >
        ${repeat(this.items, (item, i) => resolveImageSource(item.src) === null ? html`
          <!-- 출처 정책이 막은 이미지는 요청하지 않는다 — 열 것이 없으므로 버튼도 아니다. -->
          <div class="slide blocked">${this.blockedLabel(item)}</div>
        ` : html`
          <!-- 썸네일은 라이트박스를 여는 버튼이다 — 클릭만 받는 div 는 키보드로 열 수 없었다.
               대체 텍스트가 있으면 그것이 이름이고, 없으면 «이미지 N 열기» 로 이름을 준다. -->
          <button type="button" class="slide"
            aria-label=${item.alt ? nothing : messages.text('openImage', { index: i + 1 })}
            @click=${() => this.open(i)}>
            <img
              src=${resolveImageSource(item.src)!}
              alt=${item.alt || ''}
              loading="lazy"
            />
            <span class="caption"
              ?hidden=${!item.caption}>
              ${item.caption}
            </span>
          </button>
        `)}
      </u-carousel>

      ${this.renderLightbox()}
    `;
  }

  /** 출처 정책(`setAllowedImagePrefixes`)이 막은 이미지 자리의 문구. */
  private blockedLabel(item: ImageSlide): string {
    return item.alt
      ? messages.text('imageBlockedNamed', { name: item.alt })
      : messages.text('imageBlocked');
  }

  private renderLightboxImage(img: ImageSlide) {
    const src = resolveImageSource(img.src);
    return src === null
      ? html`<div class="lb-blocked">${this.blockedLabel(img)}</div>`
      : html`<img src=${src} alt=${img.alt || ''} />`;
  }

  private renderLightbox() {
    const idx = this.index;
    if (idx === null) return nothing;
    if (idx < 0 || idx >= this.items.length) return nothing;
    const item = this.items[idx];
    if (!item) return nothing;

    const total = this.items.length;

    // 트랙 위치: 현재 슬라이드(70vw)를 뷰포트 중앙에 배치
    // center = 50vw - 35vw = 15vw, 슬라이드 간격 = 70vw + 16px gap
    const translateX = `calc(15vw - ${idx} * (70vw + 16px))`;

    return html`
      <div class="lb-overlay">

        <!-- 상단: 카운터(중앙) + 닫기 버튼(우측) -->
        <header class="lb-header">
          <div class="lb-counter" ?hidden=${total <= 1}>
            ${idx + 1} / ${total}
          </div>
          <button class="lb-close" aria-label=${messages.text('closeLightbox')} @click=${this.close}>
            <u-icon lib="internal" name="x"></u-icon>
          </button>
        </header>

        <!-- 중앙: 뷰포트 + 이전/다음 버튼(absolute 오버레이) -->
        <div class="lb-body">
          <div class="lb-viewport">
            <div class="lb-track" style="transform:translateX(${translateX})">
              ${repeat(this.items, (img, i) => html`
                <div class="lb-slide" ?active=${i === idx}>
                  ${this.renderLightboxImage(img)}
                </div>
              `)}
            </div>
          </div>

          <button class="lb-nav prev"
            ?hidden=${idx <= 0}
            aria-label=${messages.text('previousImage')}
            @click=${this.handlePrevClick}>
            <u-icon lib="internal" name="chevron-left"></u-icon>
          </button>

          <button class="lb-nav next"
            ?hidden=${idx >= total - 1}
            aria-label=${messages.text('nextImage')}
            @click=${this.handleNextClick}>
            <u-icon lib="internal" name="chevron-right"></u-icon>
          </button>
        </div>

        <!-- 하단: 캡션 -->
        <footer class="lb-footer" ?hidden=${!item.caption}>
          <p class="lb-caption">${item.caption}</p>
        </footer>

      </div>
    `;
  }

  public open = (i: number) => {
    this.index = i;
  }

  public close = () => {
    this.index = null;
  }

  public prev = () => {
    if (this.index !== null && this.index > 0) {
      this.index--;
    }
  }

  public next = () => {
    if (this.index !== null && this.index < this.items.length - 1) {
      this.index++;
    }
  }

  private handlePrevClick = (e: Event) => {
    e.stopPropagation();
    this.prev();
  }

  private handleNextClick = (e: Event) => {
    e.stopPropagation();
    this.next();
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.index === null) return;
    // Escape 는 층 스택이 다룬다(위 `updated`) — 여기는 넘기기 화살표만.
    if (e.key === 'ArrowLeft') this.prev();
    else if (e.key === 'ArrowRight') this.next();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "u-images-block": UImagesBlock;
  }
}
