import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { styles } from "./UMapBlock.styles.js";
import { registerElementBlock } from '../utilities/ElementRegistry.js';
import schema from './UMapBlock.schema.js';
import { messages } from '../utilities/messages.js';
import { LinkActivationController } from '../utilities/LinkActivation.js';

// 이 모듈을 import 하면 block-json 으로 렌더할 수 있다(스키마가 허용 목록이다).
registerElementBlock(schema);

/**
 * 지도 블록 컴포넌트 (OpenStreetMap embed)
 *
 * @event link-activate - 사람이 렌더된 링크를 활성화했다(클릭 · 가운데 클릭 · Enter). 취소 가능 — 막으면 브라우저 이동도 막힌다. detail: `LinkActivateEventDetail`
 */
@customElement('u-map-block')
export class UMapBlock extends UElement {
  /** 렌더된 링크를 누르면 `link-activate` 로 호스트에 묻는다(`LinkActivation`). */
  protected readonly linkActivation = new LinkActivationController(this);

  static styles = [super.styles, styles];

  /** 위도 (latitude) */
  @property({ type: Number }) lat?: number;
  /** 경도 (longitude) */
  @property({ type: Number }) lng?: number;
  /** 지도 확대 레벨 (zoom level, 기본값: 15) */
  @property({ type: Number }) zoom = 15;
  /** 지도 마커 라벨 */
  @property({ type: String }) label?: string;
  /** 지도 마커 설명 */
  @property({ type: String }) description?: string;

  render() {
    if (this.lat == null || this.lng == null) return nothing;

    const offset = 360 / Math.pow(2, this.zoom);
    const bbox = `${this.lng - offset},${this.lat - offset},${this.lng + offset},${this.lat + offset}`;
    const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${this.lat},${this.lng}`;
    const linkUrl = `https://www.openstreetmap.org/?mlat=${this.lat}&mlon=${this.lng}#map=${this.zoom}/${this.lat}/${this.lng}`;

    return html`<div class="base" part="base">
      <iframe
        src="${embedUrl}"
        loading="lazy"
      ></iframe>
      <a class="caption"
        ?hidden=${!this.label && !this.description}
        href="${linkUrl}"
        target="_blank"
        rel="noopener noreferrer"
      >
        <strong>${this.label}</strong>
        <span>${this.description}</span>
        <span class="new-tab-hint">${messages.text('opensInNewTab')}</span>
      </a>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-map-block": UMapBlock;
  }
}
