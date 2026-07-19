/**
 * `stop` 이벤트의 detail 페이로드.
 * 현재는 추가 컨텍스트가 없으므로 빈 객체이며, 향후 확장 대비 interface로 유지.
 */
// 향후 필드 추가 시 interface 를 그대로 확장할 수 있도록 빈 형태를 유지한다.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StopEventDetail {
  // reserved for future fields (e.g., reason)
}
export type StopEvent = CustomEvent<StopEventDetail>;

declare global {
  interface HTMLElementEventMap {
    'stop': StopEvent;
  }
}
