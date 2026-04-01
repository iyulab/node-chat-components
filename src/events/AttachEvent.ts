export interface AttachEventDetail {
  files: File[];
}
export type AttachEvent = CustomEvent<AttachEventDetail>;

declare global {
  interface HTMLElementEventMap {
    'attach': AttachEvent;
  }
}