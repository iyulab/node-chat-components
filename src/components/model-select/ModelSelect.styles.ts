import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    display: block;
    background-color: var(--uc-background-color-0);
    border: 1px solid var(--uc-border-color-low);
    border-radius: 8px;
    padding: 8px 12px;
    box-sizing: border-box;
  }

  .selecter {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 14px;
    line-height: 16px;
    gap: 8px;
  }

  /* 리스트 스타일 */
  .list {
    position: absolute;
    width: max-content;
    top: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    visibility: hidden;
    opacity: 0;

    border-radius: 8px;
    border: 1px solid var(--uc-border-color-low);
    background-color: var(--uc-background-color-0);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    max-height: 260px;
    overflow: auto;
    box-sizing: border-box;

    scrollbar-color: var(--uc-background-color-800) transparent;
    scrollbar-width: thin;
  }
  .list.open {
    visibility: visible;
    opacity: 1;
  }

  .item {
    position: relative;
    padding: 6px 12px;
    display: flex;
    flex-direction: column;
    transition: background-color 0.2s, color 0.2s;
    box-sizing: border-box;
    cursor: pointer;
    
    .display {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      line-height: 20px;
      font-weight: 600;
    }

    .description {
      font-size: 12px;
      line-height: 20px;
      font-weight: 300;
      opacity: 0.6;
    }
  }
  .item[selected] {
    color: var(--uc-blue-color-500);
  }
  .item:hover {
    background-color: var(--uc-background-color-300);
  }
`;