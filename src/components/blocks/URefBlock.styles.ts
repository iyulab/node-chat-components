import { css } from "lit";

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /* 헤더 영역 */
  .header {
    all: unset;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    color: var(--u-txt-color-strong);
    user-select: none;
    cursor: pointer;
  }
  .header:hover {
    color: var(--u-txt-color-hover);
  }
  .header:focus-visible {
    outline: 2px solid rgba(100, 150, 250, 0.6);
    outline-offset: 2px;
  }

  u-icon {
    color: inherit;
    font-size: 1em;
    transition: transform 0.2s ease-in-out;
  }
  u-icon[collapsed] {
    transform: rotate(-90deg);
  }

  .title {
    color: inherit;
    font-size: 1em;
    line-height: 1.5;
    font-weight: 600;
    /* 여기 color: var(--u-text-color-weak) 가 있었다 — 그런 토큰은 없다
       (올바른 이름은 --u-txt-color-weak). 폴백도 없어 선언이 통째로 무효가 됐고,
       그래서 위의 color: inherit 과 결과가 같았다. 즉 한 번도 적용된 적이 없는
       선언이다. 형제 .count 도 inherit 이므로 현재 렌더를 유지하며 죽은 선언만
       걷는다. 제목을 약한 회색으로 하려던 의도였다면 이름을 고쳐 되살릴 것. */
  }

  .count {
    color: inherit;
    font-size: 0.75em;
    font-weight: 400;
    line-height: 2em;
  }

  /* 바디 영역 */
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.75em;
    margin-top: 0.75em;
    transition: all 0.3s ease-in-out;
  }
  .body[collapsed] {
    height: 0;
    opacity: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .body u-ref-card {
    width: 100%;
  }
`;
