import { nothing } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { BaseElement } from "../../internal/BaseElement.js";
import { styles } from "./Icon.styles.js";
import { until } from "lit/directives/until.js";
// vite에서 제공하는 glob 기능을 사용하여 SVG 아이콘을 가져옵니다.(다른 빌드 도구에서는 사용 불가)
const icons = import.meta.glob('../../assets/icons/*.svg', { 
  eager: true,
  query: '?raw'
});

/**
 * 아이콘 컴포넌트입니다.
 * SVG 아이콘을 이름으로 불러와서 렌더링합니다.
 */
export class Icon extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {};
  /** 기본 아이콘 데이터의 레지스트리입니다. */
  static registry: Record<string, string> = Object.fromEntries(
    Object.entries(icons).map(([path, module]) => {
      const name = path.split('/').pop()?.replace('.svg', '') || '';
      return [name, (module as any).default] as [string, string];
    }).filter(([name]) => name !== '')
  );
  /** 아이콘을 외부에서 불러올 때 사용할 기본 경로입니다. */
  static externalPath = '/assets/icons/';

  /** 아이콘을 외부에서 불러와야 하는지 여부를 설정합니다. */
  @property({ type: Boolean }) external: boolean = false;
  /** 아이콘의 이름을 지정합니다. */
  @property({ type: String }) name?: string;

  render() {
    if (!this.name) return nothing;

    return until(this.loadSvgContent(this.name).then(html => {
      if (!this.validateSvgContent(html)) return nothing;
      return unsafeHTML(html);
    }), nothing);
  }

  /**
   * 아이콘의 HTML 콘텐츠를 가져옵니다.
   * 외부 아이콘 경로를 사용하거나, 내부 레지스트리에서 아이콘을 찾습니다.
   * @param name 아이콘 이름
   */
  private async loadSvgContent(name: string): Promise<string | undefined> {
    if (this.external) {
      // 외부 아이콘을 불러오는 경우
      const url = Icon.externalPath.endsWith('/')
        ? `${Icon.externalPath}${name}.svg`
        : `${Icon.externalPath}/${name}.svg`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) return undefined;
        return (await response.text())?.trim();
      } catch (error) {
        console.error(error);
        return undefined;
      }
    } else {
      // 내부 아이콘을 불러오는 경우
      return Icon.registry[name]?.trim();
    }
  }

  /**
   * SVG 콘텐츠가 유효한 HTML인지 검사합니다.
   */
  private validateSvgContent(html?: string): boolean {
    // HTML이 비어 있거나 null인 경우
    if (!html) return false;

    // SVG 태그로 끝나는지 확인
    if (!html.endsWith('</svg>')) return false;

    // SVG 태그가 포함되어 있는지 확인
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(html, 'image/svg+xml');
    // return doc.documentElement.tagName.toLowerCase() === 'svg';

    return true;
  }
}
