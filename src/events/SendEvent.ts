export type SendEventDetail = unknown;
export type SendEvent = CustomEvent<SendEventDetail>;

declare global {
  interface HTMLElementEventMap {
    'send': SendEvent;
  }
}