export type USubmitMessageEvent = CustomEvent<string>;

declare global {
  interface HTMLElementEventMap {
    'u-submit': USubmitMessageEvent;
  }
}