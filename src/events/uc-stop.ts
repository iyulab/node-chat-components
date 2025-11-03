export type StopMessageEvent = CustomEvent<undefined>;

declare global {
  interface HTMLElementEventMap {
    'stop': StopMessageEvent;
  }
}