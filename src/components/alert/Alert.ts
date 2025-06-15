import { html, PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { Icon } from '../icon/Icon.js';
import type { AlertConfig, AlertStatus } from './Alert.types.js';
import { styles } from './Alert.styles.js';

/**
 * 사용자에게 메시지를 표시하는 Alert 컴포넌트입니다.
 * 자동 닫힘 타이머, 접기/펼치기 기능 등을 제공합니다.
 */
export class Alert extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-icon': Icon,
  }
  
  private timeoutId?: number;

  @query('.progress-bar') progressBarEl!: HTMLElement;
  @query('.body') bodyEl!: HTMLElement;

  @state() overflow: boolean = false;
  @state() collapsed: boolean = true;

  /** Alert 표시 여부 */
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  /** Alert 상태 (warning, danger, info, success) */
  @property({ type: String, reflect: true }) status: AlertStatus = "danger";
  /** 본문 최소 행 수 */
  @property({ type: Number }) minRows: number = 3;
  /** 본문 최대 행 수 */
  @property({ type: Number }) maxRows: number = 10;
  /** Alert 제목 */
  @property({ type: String }) headline?: string;
  /** Alert 본문 내용 */
  @property({ type: String }) value?: string;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    
    if (changedProperties.has('minRows') && this.minRows < this.maxRows && this.minRows > 0) {
      this.style.setProperty('--min-rows', `${this.minRows}`);
    }
    if (changedProperties.has('maxRows') && this.maxRows > this.minRows && this.maxRows > 0) {
      this.style.setProperty('--max-rows', `${this.maxRows}`);
    }
    if (changedProperties.has('value') || changedProperties.has('minRows') || changedProperties.has('maxRows')) {
      this.updateOverflowState();
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="progress">
          <div class="progress-bar"></div>
        </div>
        <div class="header">
          <uc-icon class="icon" name=${this.status}></uc-icon>
          <div class="title">${this.headline || this.status.toUpperCase()}</div>
          <div class="flex"></div>
          <uc-icon class="close-btn" name="x-lg" @click=${this.hide}></uc-icon>
        </div>
        <div class="body scroll" ?collapsed=${this.collapsed}>
          ${this.value || html`<slot></slot>`}
        </div>
        <div class="footer">
          <div class="more-btn" ?hidden=${!this.overflow}
            @click=${() => this.collapsed = !this.collapsed}>
            <uc-icon name=${this.collapsed ? "chevron-down" : "chevron-up"}></uc-icon>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Alert를 상세히 표시합니다.
   * @param config - Alert 설정 객체
   */
  public async show(config: AlertConfig) {
    this.status = config.status || "danger";
    this.headline = config.headline;
    this.value = config.value;

    await this.updateComplete;
    this.open = true;
    this.dispatch("show-alert");

    if (config.timeout && config.timeout > 0) {
      this.progressBarEl.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
        duration: config.timeout,
        easing: 'linear',
        fill: 'forwards',
      });

      this.timeoutId = window.setTimeout(() => {
        this.hide();
      }, config.timeout);
    }
  }

  /**
   * Alert를 숨깁니다.
   */
  public async hide() {
    await this.updateComplete;
    this.open = false;
    clearTimeout(this.timeoutId);
    this.timeoutId = undefined;
    this.style.transition = '';
    this.style.transform = '';
    this.dispatch("hide-alert");
  }

  /**
   * 본문 내용이 오버플로우되는지 확인하고,
   * 필요시 접기/펼치기 상태를 업데이트합니다.
   */
  private updateOverflowState = async () => {
    if (!this.bodyEl) return;
    await this.updateComplete;
    const scrollHeight = this.bodyEl.scrollHeight;
    const clientHeight = this.bodyEl.clientHeight;
    this.overflow = scrollHeight > clientHeight;
    this.collapsed = true;
  }
}
