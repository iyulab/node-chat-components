/**
 * `stop` 이벤트의 detail 페이로드.
 * 현재는 추가 컨텍스트가 없으므로 빈 객체이며, 향후 확장 대비 interface로 유지.
 */
export interface StopEventDetail {
  // reserved for future fields (e.g., reason)
}
export type StopEvent = CustomEvent<StopEventDetail>;

declare global {
  interface HTMLElementEventMap {
    'stop': StopEvent;
    /**
     * @deprecated 0.5.1부터 `stop`과 동시에 발생합니다. 0.6.0에서 제거 예정.
     * 새 코드는 `stop`를 사용하세요.
     */
    'u-cancel': StopEvent;
  }
}
