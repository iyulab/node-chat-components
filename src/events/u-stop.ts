export type UStopMessageEvent = CustomEvent<undefined>;

declare global {
  interface HTMLElementEventMap {
    'u-stop': UStopMessageEvent;
  }
}