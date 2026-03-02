import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
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
export class UImagesWidget extends UElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof UElement> = {
    'u-carousel': UCarousel,
    'u-icon': UIcon,
  };

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
    super.disconnectedCallback();
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
        ${repeat(this.items, (item, i) => html`
          <div class="slide" 
            @click=${() => this.open(i)}>
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

      ${this.renderLightbox()}
    `;
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
          <button class="lb-close" @click=${this.close}>
            <u-icon lib="internal" name="x-lg"></u-icon>
          </button>
        </header>

        <!-- 중앙: 뷰포트 + 이전/다음 버튼(absolute 오버레이) -->
        <div class="lb-body">
          <div class="lb-viewport">
            <div class="lb-track" style="transform:translateX(${translateX})">
              ${repeat(this.items, (img, i) => html`
                <div class="lb-slide" ?active=${i === idx}>
                  <img src=${img.src} alt=${img.alt || ''} />
                </div>
              `)}
            </div>
          </div>

          <button class="lb-nav prev"
            ?hidden=${idx <= 0}
            @click=${this.handlePrevClick}>
            <u-icon lib="internal" name="chevron-left"></u-icon>
          </button>

          <button class="lb-nav next"
            ?hidden=${idx >= total - 1}
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
    if (e.key === 'Escape') this.close();
    else if (e.key === 'ArrowLeft') this.prev();
    else if (e.key === 'ArrowRight') this.next();
  };
}
