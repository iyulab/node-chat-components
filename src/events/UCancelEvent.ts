export type UCancelEvent = CustomEvent<undefined>;

declare global {
  interface HTMLElementEventMap {
    'u-cancel': UCancelEvent;
  }
}