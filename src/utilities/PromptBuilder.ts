import template from '../assets/prompts/element-prompt.md?raw';
import { type ElementSchema } from '../types/Schema.js';
import { registerElementBlock, registerFenceBlock, type FenceBlock } from './ElementRegistry.js';

/** LLM 에게 알릴 펜스 블록 — 등록(`FenceBlock`)과 모델용 설명. */
export interface FenceBlockSchema extends FenceBlock {
  /** 이 블록이 무엇을 그리는지 · 언제 쓰는지(LLM용) */
  description?: string;
  /** 펜스 본문의 예(LLM용) */
  example?: string;
}

/**
 * Element(부가 렌더링 블록) 등록, LLM 인스트럭션 빌드, HTML 렌더링을 통합 제공하는 유틸리티
 */
export class ElementPromptBuilder {
  private static _instance: ElementPromptBuilder;
  private elements = new Map<string, ElementSchema>();
  private fences = new Map<string, FenceBlockSchema>();

  /**
   * 싱글톤 인스턴스를 반환합니다. 최초 호출 시 인스턴스가 생성됩니다.
   */
  public static get instance(): ElementPromptBuilder {
    if (!this._instance) {
      this._instance = new ElementPromptBuilder();
    }
    return this._instance;
  }

  /**
   * Element 정의를 등록합니다. 같은 태그가 이미 등록되어 있으면 에러를 던집니다.
   *
   * LLM 에게 알리는 스키마가 곧 `u-element-block` 의 허용 목록이므로, 여기서 추가한 블록은
   * `block-json` 으로도 렌더할 수 있게 함께 등록됩니다(`registerElementBlock`).
   * @throws {Error} 같은 태그가 이미 등록된 경우
   */
  public add(schema: ElementSchema): ElementPromptBuilder {
    if (this.elements.has(schema.tag)) {
      throw new Error(`Element with tag "${schema.tag}" is already registered.`);
    }

    this.elements.set(schema.tag, schema);
    registerElementBlock(schema);
    return this;
  }

  /**
   * 펜스 언어를 블록에 잇고(`registerFenceBlock`) LLM 인스트럭션에 그 펜스를 싣습니다 — 본문이 텍스트 하나인
   * 블록(다이어그램 DSL · 수식 등)을 `block-json` 의 JSON 문자열 안에 넣지 않고 펜스에 그대로 쓰게 합니다.
   * @throws {Error} 같은 펜스 언어가 이미 등록된 경우
   */
  public addFence(schema: FenceBlockSchema): ElementPromptBuilder {
    const lang = schema.lang.trim().toLowerCase();
    if (this.fences.has(lang)) {
      throw new Error(`Fence block "${lang}" is already registered.`);
    }
    registerFenceBlock(schema);
    this.fences.set(lang, { ...schema, lang });
    return this;
  }

  /**
   * 등록된 Element들에 대한 LLM 인스트럭션 문자열을 생성합니다.
   */
  public build(): string {
    if (this.elements.size === 0 && this.fences.size === 0) return '';

    const defs = Array.from(this.elements.values());
    const docs = defs.map(def => {
        const lines: string[] = [
          `### ${def.tag}`,
          '',
          '**JSON Schema:**',
          '```block-json',
          JSON.stringify({
            type: 'object',
            description: def.description,
            properties: {
              tag: {
                type: 'string',
                enum: [def.tag]
              },
              properties: {
                type: 'object',
                properties: def.properties || {},
                required: def.required || []
              }
            },
            required: ['tag'],
          }, null, 2),
          '```',
        ];
        return lines.join('\n');
      })
      .join('\n\n---\n\n');

    const fenceDocs = Array.from(this.fences.values()).map(fence => {
      const body = fence.as === 'json' ? 'a JSON value' : 'plain text';
      const lines: string[] = [
        `### \`${fence.lang}\` fence`,
        '',
        ...(fence.description ? [fence.description, ''] : []),
        `Write the content as ${body} directly inside a \`${fence.lang}\` fenced code block — do not wrap it in \`block-json\`.`,
        ...(fence.example ? ['', '```' + fence.lang, fence.example, '```'] : []),
      ];
      return lines.join('\n');
    });

    return template.replace('{{EXTRA_DOCS}}', [docs, ...fenceDocs].filter(Boolean).join('\n\n---\n\n'));
  }
}
