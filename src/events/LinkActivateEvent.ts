/**
 * `link-activate` 이벤트의 detail 페이로드.
 * - `href`: 활성화된 링크의 절대 주소(브라우저가 푼 값)
 * - `originalEvent`: 링크를 활성화한 누름 — 버튼(`button`)과 수식 키(`ctrlKey`·`metaKey`·`shiftKey`·`altKey`)로
 *   «사람이 새 탭을 원했는가» 를 호스트가 가른다(SPA 라우터는 수식 키 누름을 브라우저에 맡기는 것이 관례다)
 */
export interface LinkActivateEventDetail {
  href: string;
  originalEvent: MouseEvent;
}
export type LinkActivateEvent = CustomEvent<LinkActivateEventDetail>;

declare global {
  interface HTMLElementEventMap {
    'link-activate': LinkActivateEvent;
  }
}
