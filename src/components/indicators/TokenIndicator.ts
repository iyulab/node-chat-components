import { html, PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { styles } from './TokenIndicator.styles.js';

/**
 * 토큰 사용량을 게이지로 표시하는 컴포넌트입니다.
 * 사용량, 제한, 백분율을 시각적으로 나타냅니다.
 */
export class TokenIndicator extends BaseElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-icon': BaseElement,
    'uc-tooltip': BaseElement,
  };

  private previousAngle: number = -61; // 초기값

  @query('.pointer') pointerEl!: SVGGElement;

  @state() percentage: number = 0;

  @property({ type: String, reflect: true }) type: 'panel' | 'button' = 'panel';
  @property({ type: Number }) maxValue = 100_000_000;
  @property({ type: Number }) value = 0;

  protected willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('value') || changedProperties.has('max')) {
      this.percentage = this.calculatePercentage(this.value);
    }
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('percentage') && this.percentage >= 0) {
      this.calculateAngle(this.percentage);
    }
  }

  render() {
    if (this.type === 'panel') {
      return this.renderGauge();
    } else {
      return html`
        <uc-icon name="gauge"></uc-icon>
        <uc-tooltip placement="bottom">
          ${this.renderGauge()}
        </uc-tooltip>
      `;
    }
  }

  private renderGauge() {
    return html`
      <div class="gauge-container">
        <div class="title">Token Usage</div>  
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 446.25 207.24127197265625">
          <g transform="translate(57.82000000000001, 28.560000000000002)">
            <g class="doughnut">
              <g class="first-arc">
                <path d="M-157.69,-8.447A7,7,0,0,1,-164.516,-16.129A165.305,165.305,0,0,1,-94.019,-135.964A7,7,0,0,1,-83.988,-133.729L-74.364,-117.2A7,7,0,0,1,-76.371,-107.963A132.244,132.244,0,0,0,-131.468,-14.306A7,7,0,0,1,-138.567,-8.065Z"></path>
              </g>
              <g class="second-arc">
                <path d="M-74.842,-139.054A7,7,0,0,1,-71.834,-148.881A165.305,165.305,0,0,1,67.183,-151.037A7,7,0,0,1,70.494,-141.308L61.387,-124.489A7,7,0,0,1,52.455,-121.396A132.244,132.244,0,0,0,-56.194,-119.711A7,7,0,0,1,-65.218,-122.525Z"></path>
              </g>
              <g class="third-arc">
                <path d="M79.801,-136.269A7,7,0,0,1,89.757,-138.814A165.305,165.305,0,0,1,164.516,-16.129A7,7,0,0,1,157.69,-8.447L138.567,-8.065A7,7,0,0,1,131.468,-14.306A132.244,132.244,0,0,0,72.986,-110.279A7,7,0,0,1,70.694,-119.45Z"></path>
              </g>
            </g>
            <g class="pointer">
              <path d="M -12.905965952897132 0.13556698776106568 L -58.90296386143058 -107.09647254172083 L 12.905965952897132 -15.129566987761063"></path>
              <circle cx="0" cy="-7.497" r="14.994"></circle>
            </g>
          </g>
        </svg>
        
        <div class="display">
          <span class="label">Usage</span>
          <span class="label">Limit</span>
          <span class="label">Percent</span>

          <span class="value">${this.formatValue(this.value)}</span>
          <span class="value">${this.formatValue(this.maxValue)}</span>
          <span class="value">${this.percentage.toFixed(0)}%</span>
        </div>
      </div>
    `;
  }

  /**
   * 현재 값과 최대 값을 기반으로 백분율을 계산합니다.
   * 최대값을 초과하는 경우 최대값으로 클램핑합니다.
   */
  private calculatePercentage(value: number): number {
    const clampedValue = Math.min(value, this.maxValue);
    return (clampedValue / this.maxValue) * 100;
  }

  /**
   * 현재 백분율에 따라 포인터의 회전 각도를 계산하고 애니메이션을 적용합니다.
   */
  private calculateAngle(percentage: number) {
    const currentAngle = -61 + (percentage / 100) * 180;

    if (!this.pointerEl) return;
    this.pointerEl.animate(
      [
        { transform: `translate(165.305px, 165.305px) rotate(${this.previousAngle}deg)` },
        { transform: `translate(165.305px, 165.305px) rotate(${currentAngle}deg)` }
      ],
      {
        duration: 500,
        easing: 'ease-in-out',
        fill: 'forwards',
      }
    );

    // 다음 애니메이션을 위해 저장
    this.previousAngle = currentAngle;
  }

  /**
   * 숫자를 읽기 쉬운 형식으로 변환합니다.
   * 1,000 이상은 K, 1,000,000 이상은 M, 1,000,000,000 이상은 B로 표시합니다.
   */
  private formatValue(value: number): string {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(0) + 'B';
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(0) + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(0) + 'K';
    } else {
      return value.toString();
    }
  }  
}