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
      <div class="card-group">
        <div class="navigation">
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
        
        <div class="divider"></div>
        
        <div class="card-container">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
  }

  /**
   * 현재 인덱스에 해당하는 카드만 표시하도록 변경합니다.
   */
  public change(index: number) {
    this.currentIndex = index;
    this.cards.forEach((card, idx) => {
      card.style.display = idx === index ? 'block' : 'none';
    });
  }

  /**
   * slot 내용이 변경될 때 호출됩니다.
   */
  private handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const elements = slot.assignedElements({ flatten: true });
    this.cards = elements.filter(el => el instanceof URefCard);
    
    // 모든 카드를 숨기고 현재 인덱스의 카드만 표시
    this.change(0);
  }

  /**
   * 이전 카드로 이동합니다.
   */
  private handlePreviousButtonClick() {
    if (this.currentIndex > 0) {
      this.change(--this.currentIndex);
    } else {
      this.change(this.cards.length - 1);
    }
  }

  /**
   * 다음 카드로 이동합니다.
   */
  private handleNextButtonClick() {
    if (this.currentIndex < this.cards.length - 1) {
      this.change(++this.currentIndex);
    } else {
      this.change(0);
    }
  }
}
