export type SubmitMessageEvent = CustomEvent<string>;

declare global {
  interface HTMLElementEventMap {
    'submit': SubmitMessageEvent;
  }
}
