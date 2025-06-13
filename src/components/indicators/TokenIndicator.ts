import { html, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { styles } from './TokenIndicator.styles.js';

/**
 * 토큰 사용량을 표시하는 컴포넌트입니다.
 * 경고 및 임계값을 설정할 수 있으며, 현재 사용량과 최대값을 표시합니다.
 */
export class TokenIndicator extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {};

  @query('.gauge-bar') gaugeBarEl!: HTMLElement;

  /** 현재 상태를 나타내는 속성입니다. 'normal', 'warning', 'critical' 중 하나의 값을 가집니다. */
  @property({ type: String, reflect: true }) status: 'normal' | 'warning' | 'critical' = 'normal';
  /** 경고값을 초과할 때의 색상을 설정하는 속성입니다. 0.0 ~ 1.0 사이의 값으로 설정합니다. */
  @property({ type: Number }) warningThreshold = 0.6;
  /** 임계값을 초과할 때의 색상을 설정하는 속성입니다. 0.0 ~ 1.0 사이의 값으로 설정합니다. */
  @property({ type: Number }) criticalThreshold = 0.8;
  /** 최대 사용량을 설정하는 속성입니다. */
  @property({ type: Number }) maxValue = 0;
  /** 현재 사용량을 설정하는 속성입니다. */
  @property({ type: Number }) value = 0;

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('value') || changedProperties.has('maxValue')) {
      this.updateValue();
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="title">
          TOKEN USAGE
        </div>
        <div class="values">
          <div class="current-value">
            ${this.formatValue(this.value)}
          </div>
          <div class="max-value">
            ${this.maxValue > 0 ? this.formatValue(this.maxValue) : 'unknown'}
          </div>
        </div>
        <div class="gauge">
          <div class="gauge-bar"></div>
        </div>
      </div>
    `;
  }

  /**
   * 현재 값과 최대값을 기반으로 게이지 바의 크기를 업데이트합니다.
   * 경고 및 임계값에 따라 게이지 바의 색상을 변경합니다.
   */
  private updateValue = async () => {
    await this.updateComplete;
    if (this.value < 0 || this.maxValue < 1) return;

    const ratio = Math.min(this.value / this.maxValue, 1);
    this.gaugeBarEl.style.transform = `scaleX(${ratio})`;
    this.status = ratio >= this.criticalThreshold ? 'critical' 
      : ratio >= this.warningThreshold ? 'warning'
      : 'normal';
  }

  /**
   * 숫자 값을 포맷하여 문자열로 반환합니다.
   * 값이 0 이하인 경우 '0'을 반환합니다.
   */
  private formatValue = (value: number) => {
    if (!value || value < 0) return '0';
    return value.toLocaleString();
  }
}