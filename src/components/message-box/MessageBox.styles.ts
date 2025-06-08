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
    margin-left: 50px;
  }
  .user-msg .msg-body {
    background-color: var(--uc-background-color-200);
    padding: 8px 12px;
    border-radius: 8px;
  }

  .assistant-msg {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    height: auto;
    box-sizing: border-box;
  }
  .assistant-msg .avatar {
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border: 1px solid var(--uc-border-color-mid);
    border-radius: 50%;
    margin-right: 16px;
    box-sizing: border-box;
  }
  .assistant-msg .msg-main {
    display: flex;
    flex-direction: column;
    width: calc(100% - 50px);
  }
  .assistant-msg .msg-header {
    align-self: flex-start;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    margin-bottom: 12px;
  }
  .assistant-msg .msg-body {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
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