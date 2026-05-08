/**
 * Marked 파싱 중 HTML이 GFM에 의해 오염되는 것을 방지하기 위해
 * HTML을 주석 플레이스홀더로 치환하고, 나중에 원래 HTML로 복원하는 유틸입니다.
 */
export class HtmlPlaceholder {
  private map: Record<string, string> = {};
  private idx = 0;

  reset() {
    this.map = {};
    this.idx = 0;
  }

  store(html: string): string {
    const key = `<!--ref:${this.idx++}-->`;
    this.map[key] = html;
    return key;
  }

  restore(html: string): string {
    if (this.idx === 0) return html;
    return html.replace(/<!--ref:\d+-->/g, (key) => this.map[key] ?? "");
  }
}
