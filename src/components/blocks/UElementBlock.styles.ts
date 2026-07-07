import { css } from "lit";

export const styles = css`
  :host {
    display: contents;
  }

  /* ── 스켈레톤: 카드(좌) + 문서(우) ── */
  .sk-container {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 1em;
    margin: 0.75em 0;
    width: 100%;
  }

  .sk-card {
    flex: 0 0 40%;
    display: flex;
    flex-direction: column;
    gap: 0.55em;
  }

  .sk-doc {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;
