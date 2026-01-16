import { html } from 'lit';
import { state } from 'lit/decorators.js';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { URefCard } from './URefCard.component.js';
import { styles } from './URefCardGroup.styles.js';

/**
 * 여러 참조 카드를 그룹으로 표시하는 컴포넌트입니다.
 * 페이지네이션 기능을 제공하여 각 카드를 하나씩 탐색할 수 있습니다.
 */
export class URefCardGroup extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
    'u-ref-card': URefCard,
  };

  /** slot으로 받은 카드 엘리먼트들 */
  @state() cards: URefCard[] = [];
  /** 현재 표시 중인 카드의 인덱스 */
  @state() currentIndex: number = 0;

  render() {
    return html`
      <div class="header">
        <button class="nav-button"
          @click=${this.handlePreviousButtonClick}>
          <u-icon lib="internal" name="chevron-left"></u-icon>
        </button>
        
        <span class="page-indicator">
          ${this.currentIndex + 1} / ${this.cards.length}
        </span>
        
        <button class="nav-button"
          @click=${this.handleNextButtonClick}>
          <u-icon lib="internal" name="chevron-right"></u-icon>
        </button>
      </div>
      
      <div class="viewport">
        <div class="track" style=${`transform: translateX(-${this.currentIndex * 100}%);`}>
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
  }

  /**
   * 해당하는 인덱스에 해당하는 카드로 변경합니다.
   */
  public switch(index: number) {
    const len = this.cards.length;
    if (len === 0) return;

    this.currentIndex = index < 0 ? (len - 1) 
      : (index >= len) ? 0 
      : index;
  }

  /** 이전 카드로 이동합니다. */
  private handlePreviousButtonClick() {
    this.switch(this.currentIndex - 1);
  }

  /** 다음 카드로 이동합니다. */
  private handleNextButtonClick() {
    this.switch(this.currentIndex + 1);
  }

  /** slot 내용이 변경될 때 호출됩니다. */
  private handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const elements = slot.assignedElements({ flatten: true });
    this.cards = elements.filter(el => el instanceof URefCard);
    this.switch(0);
  }
}
