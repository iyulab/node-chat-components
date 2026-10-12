import { css } from "lit";

/**
 * 화면에는 그리지 않고 접근성 트리에만 남기는 선언 묶음(표준 «visually hidden»).
 *
 * 규칙 본문 자리에 끼워 쓴다 — `.new-tab-hint { ${visuallyHidden} }`. 절대 위치라 그 요소를 품은 쪽에
 * 위치 지정(`position: relative`)이 있어야 포함 블록이 그 안에 갇힌다 — 없으면 문서 전체가 포함 블록이 되어
 * 호스트의 `overflow` 감싸개를 건너 문서를 늘린다.
 */
export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;
