import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { Icon } from '../icon/Icon.js';
import { Tooltip } from '../tooltip/Tooltip.js';
import { styles } from './CopyButton.styles.js';

/**
 * CopyButton 컴포넌트는 클릭 시 클립보드에 텍스트를 복사하는 버튼입니다.
 * 복사 상태를 표시하기 위해 아이콘이 변경됩니다.
 */
export class CopyButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-icon': Icon,
    'uc-tooltip': Tooltip,
  };

  /** 버튼의 모드를 설정합니다. 기본은 'symbol'입니다. */
  @property({ type: String, reflect: true }) mode: 'badge' | 'symbol' = 'symbol';
  /** 클립보드 복사 상태를 나타내는 플래그입니다. */
  @property({ type: Boolean, reflect: true }) isCopied: boolean = false;
  /** 복사할 텍스트를 설정합니다. */
  @property({ type: String }) value?: string;
  /** 클립보드 복사 후 재사용 대기 시간 (ms) */
  @property({ type: Number }) delay: number = 1_000;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.copyToClipboard);
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.copyToClipboard);
    super.disconnectedCallback();
  }

  render() {
    if (this.mode === 'badge') {
      return html`
        <uc-icon name=${this.isCopied ? 'check' : 'copy'}></uc-icon>
        <span class="display">${this.isCopied ? 'Copied!' : 'Copy'}</span>
      `;
    } else if (this.mode === 'symbol') {
      return html`
        <uc-icon name=${this.isCopied ? 'check' : 'copy'}></uc-icon>
        <uc-tooltip .trigger=${this as any} placement="bottom">
          ${this.isCopied ? 'Copied!' : 'Copy'}
        </uc-tooltip>
      `;
    } else {
      return nothing;
    }
  }

  /**
   * 클립보드에 텍스트를 복사하는 메서드입니다.
   * 복사 후 재사용 대기 시간이 설정되어 있으면, 일정 시간 후에 복사 가능 상태로 되돌립니다.
   */
  private copyToClipboard = async () => {
    if (!this.value) return;
    if (this.isCopied) return;

    if (navigator.clipboard) {
      // 클립보드 API가 지원되는 경우
      await navigator.clipboard.writeText(this.value);
    } else {
      // 클립보드 API가 지원되지 않는 경우
      // 임시 textarea를 만들어서 복사합니다.
      const area = document.createElement('textarea');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      area.style.pointerEvents = 'none';
      area.value = this.value;
      document.body.appendChild(area);
      area.focus();
      area.select();

      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Failed to copy: ', err);
      } finally {
        document.body.removeChild(area);
      }
    }

    if (this.delay > 0) {
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, this.delay);
    }
  }
}