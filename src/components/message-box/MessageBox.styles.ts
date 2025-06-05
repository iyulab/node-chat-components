import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;

    --messages-padding: 10px 20% 10px 20%;
    --messages-gap: 24px;
    --fill-height: 100%;
  }

  .scroller {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    right: 32px;
    border-radius: 50%;
    cursor: pointer;
    border: 1px solid var(--uc-border-color-mid);
  }
  .scroller.top {
    top: 16px;
  }
  .scroller.bottom {
    bottom: 16px;
  }

  .container {
    display: block;
    width: 100%;
    height: 100%;
    padding: var(--messages-padding);
    box-sizing: border-box;
    overflow-y: auto;
  }

  .messages {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .messages > *:not(:last-child) {
    margin-bottom: var(--messages-gap);
  }
  .messages > :last-child {
    min-height: var(--fill-height);
  }

  .user-msg {
    display: block;
    width: auto;
    height: auto;
    align-self: flex-end;
  }

  .user-msg .msg-body {
    background-color: var(--uc-background-color-200);
    padding: 8px 12px;
    border-radius: 8px;
    max-width: 80%;
  }

  .assistant-msg {
    display: flex;
    width: 100%;
    height: auto;
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
  }

  .assistant-msg .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid var(--uc-border-color-mid);
    flex-shrink: 0;
  }

  .assistant-msg .msg-main {
    display: flex;
    width: calc(100% - 46px);
    flex-direction: column;
  }

  .assistant-msg .msg-header {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .assistant-msg .msg-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: var(--uc-background-color-100);
    padding: 8px 12px;
    border-radius: 8px;
  }

  .msg-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    font-size: 12px;
    color: var(--uc-text-color-low);
    box-sizing: border-box;
  }
`;