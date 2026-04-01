import type { ScanResult, ScannedElement, DOMCommand } from './types.js';

/**
 * DOMPromptBuilder
 * ScanResult를 LLM이 이해하기 쉬운 프롬프트로 변환하고, LLM 응답에서 명령을 추출합니다.
 */
export class DOMPromptBuilder {
  private template: string;

  constructor(template?: string) {
    this.template = template || this.getDefaultTemplate();
  }

  /**
   * 기본 프롬프트 템플릿
   */
  private getDefaultTemplate(): string {
    return `You are a web automation assistant. You can interact with web pages by executing commands on DOM elements.

**Current Page Information:**
- URL: {{url}}
- Title: {{title}}
- Timestamp: {{timestamp}}
- Viewport: {{viewport}}

**Available Elements:**
{{elements}}

**Available Commands:**
- click(id): Click an element
- input(id, text): Type text into an input field
- select(id, value): Select an option from a dropdown
- focus(id): Focus an element
- blur(id): Remove focus from an element
- scroll(x, y): Scroll the page
- scrollTo(id): Scroll to an element
- hover(id): Hover over an element
- clear(id): Clear an input field
- check(id, checked): Toggle a checkbox or radio button
- wait(ms): Wait for a specified time

**Instructions:**
1. Analyze the available elements carefully
2. Respond with a JSON array of commands to execute
3. Use the element IDs exactly as provided
4. Return ONLY valid JSON, no additional text

**Response Format:**
\`\`\`json
[
  {"action": "input", "target": "elm_abc123", "value": "example text"},
  {"action": "click", "target": "elm_def456"}
]
\`\`\`

{{contextHint}}`;
  }

  /**
   * LLM 프롬프트 생성
   */
  buildPrompt(scan: ScanResult, options?: {
    maxElements?: number;        // 최대 요소 수 (기본: 100)
    includeInvisible?: boolean;  // 보이지 않는 요소 포함
    contextHint?: string;        // 추가 컨텍스트 힌트
    template?: string;           // 커스텀 템플릿
  }): string {
    const {
      maxElements = 100,
      includeInvisible = false,
      contextHint = '',
      template = this.template
    } = options || {};

    // 요소 필터링 및 정렬
    let elements = [...scan.elements];
    if (!includeInvisible) {
      elements = elements.filter(el => el.visible);
    }
    elements.sort((a, b) => b.priority - a.priority);
    elements = elements.slice(0, maxElements);

    // 요소 리스트를 텍스트로 변환
    const elementsText = this.summarizeElements(elements);

    // 템플릿 변수 치환
    let prompt = template
      .replace('{{url}}', scan.url)
      .replace('{{title}}', scan.title)
      .replace('{{timestamp}}', new Date(scan.timestamp).toISOString())
      .replace('{{viewport}}', `${scan.viewport.width}x${scan.viewport.height}`)
      .replace('{{elements}}', elementsText)
      .replace('{{contextHint}}', contextHint ? `\n**Context:** ${contextHint}` : '');

    return prompt;
  }

  /**
   * LLM 응답에서 명령 추출
   */
  extractCommands(llmResponse: string): DOMCommand[] {
    try {
      // JSON 코드 블록 추출
      const jsonMatch = llmResponse.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : llmResponse;

      // JSON 파싱
      const parsed = JSON.parse(jsonText.trim());

      // 배열인지 확인
      if (!Array.isArray(parsed)) {
        // 단일 명령인 경우 배열로 변환
        return [this.normalizeCommand(parsed)];
      }

      // 각 명령 정규화
      return parsed.map(cmd => this.normalizeCommand(cmd));
    } catch (error) {
      console.error('[DOMPromptBuilder] Failed to extract commands:', error);
      return [];
    }
  }

  /**
   * 명령 객체 정규화
   */
  private normalizeCommand(cmd: any): DOMCommand {
    return {
      action: cmd.action,
      target: cmd.target,
      value: cmd.value,
      options: cmd.options
    };
  }

  /**
   * 요소 리스트를 LLM 친화적 텍스트로 변환
   */
  private summarizeElements(elements: ScannedElement[]): string {
    if (elements.length === 0) {
      return 'No interactive elements found.';
    }

    const lines: string[] = [];
    elements.forEach((element, index) => {
      lines.push(`${index + 1}. ${this.elementToText(element)}`);
    });

    return lines.join('\n');
  }

  /**
   * 단일 요소를 텍스트로 표현
   */
  private elementToText(element: ScannedElement): string {
    const parts: string[] = [];

    // ID (필수)
    parts.push(`[${element.id}]`);

    // 태그와 타입
    if (element.type) {
      parts.push(`${element.tag.toLowerCase()}-${element.type}`);
    } else {
      parts.push(element.tag.toLowerCase());
    }

    // 설명 (data-llm-description)
    if (element.description) {
      parts.push(`- "${element.description}"`);
    }

    // 레이블
    if (element.label) {
      parts.push(`Label: "${element.label}"`);
    }

    // 텍스트 내용 (최대 50자)
    if (element.text) {
      const truncatedText = element.text.length > 50 
        ? element.text.substring(0, 47) + '...' 
        : element.text;
      parts.push(`Text: "${truncatedText}"`);
    }

    // 값
    if (element.value !== undefined && element.value !== '') {
      parts.push(`Value: "${element.value}"`);
    }

    // Placeholder
    if (element.placeholder) {
      parts.push(`Placeholder: "${element.placeholder}"`);
    }

    // ARIA 역할
    if (element.role) {
      parts.push(`Role: ${element.role}`);
    }

    // 위치 (간략하게)
    if (element.x !== undefined && element.y !== undefined) {
      parts.push(`Position: (${Math.round(element.x)}, ${Math.round(element.y)})`);
      parts.push(`Size: ${Math.round(element.width)}x${Math.round(element.height)}`);
    }

    // 우선순위 (디버깅용, 선택사항)
    // parts.push(`Priority: ${element.priority}`);

    return parts.join(' ');
  }

  /**
   * 스크린샷을 멀티모달 메시지로 변환 (Anthropic Claude, OpenAI GPT-4V 형식)
   */
  formatMultimodalMessage(scan: ScanResult, options?: {
    maxElements?: number;
    contextHint?: string;
    screenshotFormat?: 'anthropic' | 'openai';
  }): any {
    const {
      maxElements = 100,
      contextHint = '',
      screenshotFormat = 'anthropic'
    } = options || {};

    // 텍스트 프롬프트 생성
    const textPrompt = this.buildPrompt(scan, { maxElements, contextHint });

    if (screenshotFormat === 'anthropic') {
      // Claude 형식
      return {
        role: 'user',
        content: scan.screenshot ? [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/png',
              data: scan.screenshot
            }
          },
          {
            type: 'text',
            text: textPrompt
          }
        ] : [
          {
            type: 'text',
            text: textPrompt
          }
        ]
      };
    } else {
      // OpenAI 형식
      return {
        role: 'user',
        content: scan.screenshot ? [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${scan.screenshot}`
            }
          },
          {
            type: 'text',
            text: textPrompt
          }
        ] : textPrompt
      };
    }
  }

  /**
   * 템플릿 변경
   */
  setTemplate(template: string): void {
    this.template = template;
  }

  /**
   * 현재 템플릿 가져오기
   */
  getTemplate(): string {
    return this.template;
  }
}
