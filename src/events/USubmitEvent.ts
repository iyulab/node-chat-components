export type USubmitEvent = CustomEvent<string>;

declare global {
  interface HTMLElementEventMap {
    'u-submit': USubmitEvent;
  }
}