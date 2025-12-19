export type UStopEvent = CustomEvent<undefined>;

declare global {
  interface HTMLElementEventMap {
    'u-stop': UStopEvent;
  }
}