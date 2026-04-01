export type StopEventDetail = unknown;
export type StopEvent = CustomEvent<StopEventDetail>;

declare global {
  interface HTMLElementEventMap {
    'stop': StopEvent;
  }
}