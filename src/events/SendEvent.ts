import type { FileBlockItem } from "../types/BlockItem.js";

/**
 * `send` 이벤트의 detail 페이로드.
 * - `value`: 사용자가 입력한 텍스트 (trim된 원본, 빈 문자열일 수 있음)
 * - `files`: 첨부된 파일 목록 (있는 경우)
 */
export interface SendEventDetail {
  value: string;
  files?: FileBlockItem[];
}
export type SendEvent = CustomEvent<SendEventDetail>;

declare global {
  interface HTMLElementEventMap {
    'send': SendEvent;
    /**
     * @deprecated 0.5.1부터 `send`와 동시에 발생합니다. 0.6.0에서 제거 예정.
     * 새 코드는 `send`를 사용하세요.
     */
    'u-submit': SendEvent;
  }
}
