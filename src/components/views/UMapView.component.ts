import { html, nothing } from "lit";
import { property } from "lit/decorators.js";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { styles } from "./UMapView.styles.js";

/**
 * 지도 뷰 컴포넌트 (OpenStreetMap embed)
 */
export class UMapView extends UElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof UElement> = {};

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

    return html`
      <iframe 
        src="${embedUrl}" 
        loading="lazy"
      ></iframe>
      <a class="caption" 
        ?hidden=${!this.label && !this.description}  
        href="${linkUrl}" 
        target="_blank" 
        rel="noopener"
      >
        <strong>${this.label}</strong>
        <span>${this.description}</span>
      </a>
    `;
  }
}
