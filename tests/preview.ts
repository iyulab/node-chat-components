import { LitElement, PropertyValues, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import '../src';
import { Theme, Toast } from '@iyulab/components';
import { ViewPromptBuilder } from '../src/utilities/ViewPromptBuilder.js';
import { IntentPromptBuilder } from '../src/utilities/IntentPromptBuilder.js';
import { PresetView } from '../src/types/Views.js';
import { PresetIntent } from '../src/types/Intents.js';
import type { BlockItem, FileBlockItem } from '../src/types/BlockItem';
import type { Message, AssistantMessage } from './messages';
import { messages } from './messages';
import { generateStreamingMessage, generateRandomId } from './generator';
import type { ResponseOptions } from "./generator";
import './sandbox.js';
import { DOMAgent, DOMPromptBuilder } from '../src/utilities/dom-interaction/index.js';
import type { ScanResult, DOMCommand } from '../src/utilities/dom-interaction/index.js';

@customElement('preview-app')
export class PreviewApp extends LitElement {
  private aborter: AbortController = new AbortController();
  private vb = new ViewPromptBuilder();
  private ib = new IntentPromptBuilder();
  private domAgent = new DOMAgent();
  private promptBuilder = new DOMPromptBuilder();

  @state() showPanel = false;
  @state() showSandbox = true;
  @state() instructions: string = '';
  @state() messages: Message[] = messages;
  @state() domScanResult: ScanResult | null = null;
  @state() includeScreenshot: boolean = false;
  @state() isAutomating: boolean = false;
  @state() automationGoal: string = '';

  // Response API Options
  @state() model: string = 'gpt-5-mini';
  @state() reasoningEffort: string = 'low';
  @state() webSearch: boolean = true;

  // flags
  private isUserScrolling = false;
  private automationIterations = 0;

  connectedCallback(): void {
    super.connectedCallback();

    // Theme 초기화 (선택적으로 브라우저 스토리지 사용)
    Theme.init({
      store: { type: 'localStorage', prefix: 'uui-' },
    });

    // 시스템 프롬프트에 사용할 instruction 빌드
    this.instructions = [
      'You are a helpful AI assistant that can use various views and intents to enhance your responses.',
      this.vb.use(PresetView.All).build(),
      this.ib.use(PresetIntent.All).build(),
    ].join('\n\n');

    // DOMAgent 이벤트 리스너
    this.domAgent.addEventListener('scan', (e: any) => {
      console.log('DOM Scan:', e.detail);
      this.domScanResult = e.detail;
    });

    this.domAgent.addEventListener('execute', (e: any) => {
      console.log('DOM Execute:', e.detail);
    });

    this.domAgent.addEventListener('error', (e: any) => {
      console.error('DOM Error:', e.detail);
      Toast.error(e.detail.message, {
        title: 'DOM 조작 오류',
        position: 'top-center',
        duration: 5000,
      });
    });
  }

  protected async updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('messages')) {
      if (this.isUserScrolling) return;
      await this.updateComplete;
      this.scrollToLast();
    }
  }

  render() {
    return html`
      <!-- 헤더 -->
      <div class="header">
        <span class="header-title">Chat Preview with DOM Agent</span>
        <div class="header-actions">
          <u-button @click=${() => this.showSandbox = !this.showSandbox}>
            ${this.showSandbox ? 'Hide' : 'Show'} Sandbox
          </u-button>
          <u-button @click=${this.handleScanDOM}>
            Scan DOM
          </u-button>
          <u-button @click=${this.handleGeneratePrompt}>
            Generate Prompt
          </u-button>
          <u-button @click=${this.handleStartAutomation} .disabled=${this.isAutomating}>
            ${this.isAutomating ? 'Automating...' : 'Start Automation'}
          </u-button>
          <label style="display: flex; align-items: center; gap: 4px; font-size: 14px;">
            <input type="checkbox" .checked=${this.includeScreenshot} @change=${(e: Event) => this.includeScreenshot = (e.target as HTMLInputElement).checked}>
            Screenshot
          </label>
          <u-button @click=${() => this.showPanel = !this.showPanel}>
            Settings
          </u-button>
          <u-button @click=${() => this.messages = []}>
            Clear
          </u-button>
          <u-button @click=${() => Theme.set(Theme.get() === 'dark' ? 'light' : 'dark')}>
            Theme
          </u-button>
        </div>
      </div>

      <!-- 바디 -->
      <div class="body">
        <!-- 샌드박스 (왼쪽) -->
        <div class="sandbox" ?hidden=${!this.showSandbox}>
          <sandbox-app></sandbox-app>
        </div>

        <!-- 채팅룸 (오른쪽) -->
        <div class="main" @scroll=${this.handleScroll}>
          <div class="messages">
            ${repeat(this.messages || [], msg => msg.id, msg => 
              msg.role === 'intent'
              ? html`
                <u-message variant="default" position="right">
                  ${repeat(msg.items, (_, i) => i, (item: any) => {
                    const props = item.properties || {};
                    return item.type === 'question'
                    ? html`
                      <u-question-intent
                        .question=${props.question}
                        .choices=${props.choices}
                        @u-submit=${this.handleSubmit}
                      ></u-question-intent>
                    ` : nothing
                  })}
                </u-message>`
              : msg.role === 'user'
              ? html`
                <u-message variant="bubble" position="right">
                  ${repeat(msg.items, (_, i) => i, (item) =>
                    item.type === 'text'
                    ? html`
                      <u-text-block
                        .value=${item.value}
                      ></u-text-block>`
                    : item.type === 'file'
                    ? html`
                      <u-file-block
                        .name=${item.name}
                        .type=${item.mimeType}
                        .size=${item.size}
                        .url=${item.url}
                      ></u-file-block>`
                    : nothing
                  )}
                  <div class="msg-footer" slot="footer">
                    <u-copy-button .value=${this.getTextValue(msg)}>
                      텍스트 복사
                    </u-copy-button>
                  </div>
                </u-message>`
              : msg.role === 'assistant'
              ? html`
                <u-message variant="default" position="left" style="width: 100%;">
                  <div class="msg-header" slot="header">
                    <u-icon lib="bootstrap" name="openai"></u-icon>
                    OpenAI (${this.model.toUpperCase()})
                  </div>
                  ${repeat(msg.items, (_, i) => i, (item) =>
                    item.type === 'markdown'
                    ? html`
                      <u-marked-block
                        .value=${item.value}
                        .refs=${item.refs}
                      ></u-marked-block>`
                    : item.type === 'thinking'
                    ? html`
                      <u-think-block
                        ?loading=${item.loading}
                        .value=${item.value}
                      ></u-think-block>`
                    : item.type === 'tool' ?
                    html`
                      <u-tool-block
                        ?loading=${item.loading}
                        .heading=${item.title}
                        .input=${item.input}
                        .output=${item.output}
                      ></u-tool-block>`
                    : item.type === 'reference' ?
                    html`
                      <u-ref-block
                        heading="References"
                        .sources=${item.sources}
                      ></u-ref-block>`
                    : nothing
                  )}
                  <div class="msg-footer" slot="footer">
                    <u-copy-button .value=${this.getTextValue(msg)}>
                      텍스트 복사
                    </u-copy-button>
                    <u-retry-button data-id=${msg.id} @click=${this.handleRetry}>
                      다시 시도
                    </u-retry-button>
                    <u-vote-button data-id=${msg.id} .value=${(msg as any).voteValue || 'none'} @u-change=${this.handleVote}>
                      <span slot="up">도움이 돼요</span>
                      <span slot="down">도움이 안돼요</span>
                    </u-vote-button>
                    <u-share-button data-id=${msg.id} @click=${this.handleShare}>
                      공유 하기
                    </u-share-button>
                    <u-report-button data-id=${msg.id} @click=${this.handleReport}>
                      신고 하기
                    </u-report-button>
                  </div>
                </u-message>`
              : nothing)}
          </div>

          <u-prompt
            placeholder="메시지를 입력하세요..."
            @u-remove=${(e: any) => console.log('Removed file:', e.detail.file)}
            @u-submit=${this.handleSubmit}
            @u-cancel=${this.handleCancel}>
            <div slot="left-actions">
              <u-attach-button
                multiple
                accept="image/*,.pdf,.text/plain,application/*"
                @u-change=${this.handleUpload}>
                파일 첨부
              </u-attach-button>
            </div>
          </u-prompt>
        </div>

        <!-- 사이드 패널 -->
        <aside class="aside-panel" ?hidden=${!this.showPanel}>
          <label class="field">
            <span>Model</span>
            <select .value=${this.model}
              @change=${(e: any) => this.model = e.target.value}>
              <option value="gpt-5.2">gpt-5.2</option>
              <option value="gpt-5.2-pro">gpt-5.2-pro</option>
              <option value="gpt-5-mini">gpt-5-mini</option>
              <option value="gpt-5-nano">gpt-5-nano</option>
            </select>
          </label>

          <label class="field">
            <div class="field-header">
              <span>Instructions</span>
              <u-copy-button .value=${this.instructions}>복사</u-copy-button>
            </div>
            <pre class="instructions">${this.instructions}</pre>
          </label>

          <label class="field">
            <span>Reasoning Effort</span>
            <select .value=${this.reasoningEffort}
              @change=${(e: any) => this.reasoningEffort = e.target.value}>
              <option value="none">none</option>
              <option value="minimal">minimal</option>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="xhigh">xhigh</option>
            </select>
          </label>

          <label class="field">
            <span>Tools</span>
            <label class="field row">
              <input type="checkbox"
                .checked=${this.webSearch}
                @change=${(e: any) => this.webSearch = e.target.checked}>
              <span>Web Search</span>
            </label>
            <label class="field row">
              <input type="checkbox" disabled checked>
              <span>Code Execution (coming soon)</span>
            </label>
            <label class="field row">
              <input type="checkbox" disabled checked>
              <span>Image Generation (coming soon)</span>
            </label>
          </label>
        </aside>
      </div>
    `;
  }

  // ── 메인 로직 ──

  private async generate() {
    try {
      // 마지막 메시지가 assistant가 아니라면 추가
      const messages = this.messages;
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg || lastMsg.role !== 'assistant') {
        this.messages = [...messages, {
          id: generateRandomId(),
          role: 'assistant' as const,
          items: [],
        }];
        await this.updateComplete;
      }

      // 메시지 생성 시작
      this.loading(true);
      this.isUserScrolling = false;
      const options: ResponseOptions = {
        model: this.model,
        reasoningEffort: this.reasoningEffort,
        webSearch: this.webSearch,
      };
      const stream = generateStreamingMessage(messages, this.instructions, this.aborter.signal, options);
      let msg: AssistantMessage | undefined = undefined;
      for await (msg of stream) {
        this.messages = [...this.messages.slice(0, -1), msg];
      }

      // intent-json 블록이 있는지 파싱하여 intent 메시지로 추가
      const markdown = msg?.items
        .filter(item => item.type === 'markdown')
        .map(item => item.value)
        .join('\n') ?? '';
      console.log('Generated markdown:', markdown);
      const [intents, _] = this.ib.parse(markdown);
      if (intents.length > 0) {
        this.messages = [...this.messages, {
          id: generateRandomId(),
          role: 'intent' as const,
          items: intents.map(intent => ({
            type: intent.type,
            properties: intent.properties
          })),
        }];
      }
    } catch (error) {
      if (!(error instanceof Error && error.message === 'Request was aborted.')) {
        Toast.error(`오류가 발생했습니다: ${(error as Error).message}`, {
          title: '메시지 생성 실패',
          position: 'top-center',
          duration: -1,
        });
        console.error('Message generation failed:', error);
      }
    } finally {
      this.aborter = new AbortController();
      this.loading(false);
    }
  }

  private loading(loading: boolean) {
    const prompt = this.shadowRoot?.querySelector('u-prompt') as any;
    const lastMsg = this.shadowRoot?.querySelector('u-message:last-child') as any;
    if (prompt) prompt.loading = loading;
    if (lastMsg) lastMsg.loading = loading;
  }

  // ── 이벤트 핸들러 ──

  private handleSubmit = async (e: CustomEvent) => {
    const value = e.detail.value as string;
    const files = e.detail.files as FileBlockItem[] | undefined;
    if (!value.trim() && (!files || files.length === 0)) return;

    // JSON 명령 파싱 시도
    try {
      const trimmed = value.trim();
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        const command = JSON.parse(trimmed);
        if (command.action && command.target) {
          // 1. user 메시지 추가
          this.messages = [...this.messages, {
            id: generateRandomId(),
            role: 'user' as const,
            items: [{ type: 'text', value }],
          }];
          
          // 2. DOM 명령 실행
          await this.executeCommand(command);
          return;
        }
      }
    } catch (err) {
      // JSON 파싱 실패 시 자연어 명령 처리 시도
    }

    // 자연어 DOM 명령 처리
    const domCommand = await this.parseNaturalLanguageCommand(value.trim());
    if (domCommand) {
      // 1. user 메시지 추가
      this.messages = [...this.messages, {
        id: generateRandomId(),
        role: 'user' as const,
        items: [{ type: 'text', value }],
      }];

      // 2. DOM 명령 실행
      await this.executeCommand(domCommand);
      return;
    }

    // 1. intent 메시지 제거
    const messages = this.messages.filter(msg => msg.role !== 'intent');

    // 2. user 메시지에 텍스트 + 파일 추가
    const items = [] as BlockItem[];
    if (value.trim()) {
      items.push({ type: 'text', value });
    }
    if (files && files.length > 0) {
      items.push(...files);
    }

    // 2. user 메시지 추가
    this.messages = [...messages, {
      id: generateRandomId(),
      role: 'user' as const,
      items: items,
    }];
    await this.updateComplete;
    await this.generate();
  }

  private handleCancel = () => {
    this.aborter.abort();
    this.aborter = new AbortController();
    this.loading(false);
  }

  private handleRetry = async (e: Event) => {
    const id = (e.target as HTMLElement).getAttribute('data-id');
    const idx = this.messages.findIndex(msg => msg.id === id);
    if (idx < 0) return;

    const prev = this.messages.slice(0, idx);
    this.messages = prev;

    await this.updateComplete;
    await this.generate();
  }

  private handleUpload = async (e: CustomEvent) => {
    const files: File[] = e.detail.files;
    if (!files || files.length === 0) return;

    const items = await Promise.all(files.map(async file => {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      return {
        type: 'file' as const,
        status: 'idle' as const,
        name: file.name,
        mimeType: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        data: data,
      };
    }));

    console.log('Uploaded files:', items);
    const prompt = this.shadowRoot?.querySelector('u-prompt') as any;
    if (prompt) {
      prompt.files = [...(prompt.files || []), ...items];
    }
  }

  private handleVote = (e: CustomEvent) => {
    const id = (e.target as HTMLElement).getAttribute('data-id');
    this.messages.forEach(msg => {
      if (msg.role === 'assistant' && msg.id === id) {
        msg.voteValue = e.detail.value;
      }
    });
  }

  private handleShare = (e: Event) => {
    const id = (e.target as HTMLElement).getAttribute('data-id');
    alert(`메시지 ${id}를 공유했습니다.`);
  }

  private handleReport = (e: Event) => {
    const id = (e.target as HTMLElement).getAttribute('data-id');
    alert(`메시지 ${id}를 신고했습니다.`);
  }

  private handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    // 유저가 스크롤을 올리는지 감지하여 자동 스크롤 제어
    if (target.scrollTop < target.scrollHeight - target.clientHeight - 50) {
      this.isUserScrolling = true;
    } else {
      this.isUserScrolling = false;
    }
  }

  private handleScanDOM = async () => {
    try {
      // 샌드박스 엘리먼트 찾기
      const sandbox = this.shadowRoot?.querySelector('sandbox-app');
      // console.log('[DEBUG] 1. sandbox 엘리먼트:', sandbox);
      
      if (!sandbox) {
        Toast.warning('샌드박스를 먼저 표시해주세요.', {
          title: 'Sandbox not found',
          position: 'top-center',
          duration: 3000,
        });
        return;
      }

      // 샌드박스의 Shadow DOM 내부를 스캔
      const scanRoot = sandbox.shadowRoot || sandbox;
      // console.log('[DEBUG] 2. scanRoot:', scanRoot);
      // console.log('[DEBUG] 3. scanRoot instanceof ShadowRoot:', scanRoot instanceof ShadowRoot);
      // console.log('[DEBUG] 4. scanRoot instanceof Element:', scanRoot instanceof Element);
      // console.log('[DEBUG] 5. scanRoot.children:', scanRoot.children);
      // console.log('[DEBUG] 6. scanRoot.children.length:', scanRoot.children?.length);
      
      // if (scanRoot.children && scanRoot.children.length > 0) {
      //   console.log('[DEBUG] 7. 첫 번째 자식:', scanRoot.children[0]);
      //   console.log('[DEBUG] 8. 첫 번째 자식 tagName:', scanRoot.children[0]?.tagName);
      // }
      
      // const allElements = scanRoot.querySelectorAll('*');
      // console.log('[DEBUG] 9. querySelectorAll("*") 결과 수:', allElements.length);
      // console.log('[DEBUG] 10. data-llm-description 있는 요소:', 
      //   scanRoot.querySelectorAll('[data-llm-description]').length);

      // DOM 스캔 (샌드박스 Shadow DOM을 루트로 지정)
      // console.log('[DEBUG] 11. domAgent.start() 호출 전');
      const scan = await this.domAgent.start(scanRoot, {
        maxElements: 50,
        filterStrategy: 'described',
        includeScreenshot: this.includeScreenshot,
        debug: false  // 디버그 로그 활성화하려면 true로 변경
      });

      // console.log('[DEBUG] 12. 스캔 완료 - 결과:', scan);
      // console.log('[DEBUG] 13. totalElements:', scan.totalElements);
      // console.log('[DEBUG] 14. filteredElements:', scan.filteredElements);
      // console.log('[DEBUG] 15. elements 배열:', scan.elements);

      // 스캔 결과를 메시지로 추가
      const scanMessage = this.formatScanResults(scan);
      this.messages = [...this.messages, {
        id: generateRandomId(),
        role: 'assistant' as const,
        items: [{
          type: 'markdown' as const,
          value: scanMessage
        }]
      }];

      Toast.success(`${scan.filteredElements}개의 요소를 찾았습니다.`, {
        title: 'DOM Scan Complete',
        position: 'top-center',
        duration: 3000,
      });
    } catch (error) {
      console.error('DOM scan failed:', error);
      Toast.error((error as Error).message,{
        title: 'Scan failed',
        position: 'top-center',
        duration: 5000,
      });
    }
  }

  private handleGeneratePrompt = () => {
    if (!this.domScanResult) {
      Toast.warning('Scan DOM을 먼저 실행해주세요.',{
        title: 'No scan result',
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    try {
      // LLM 프롬프트 생성
      const prompt = this.promptBuilder.buildPrompt(this.domScanResult, {
        maxElements: 50,
        contextHint: '사용자가 웹 페이지와 상호작용하려고 합니다.'
      });

      // console.log('[DEBUG] Generated Prompt:', prompt);

      // 프롬프트를 메시지로 추가
      let promptMessage = '# 생성된 LLM 프롬프트\n\n```\n' + prompt + '\n```\n\n';
      
      // 스크린샷이 있으면 표시
      if (this.domScanResult.screenshot) {
        promptMessage += '\n## 📸 스크린샷 캡처 완료\n\n';
        promptMessage += `- 이미지 크기: ${Math.round(this.domScanResult.screenshot.length / 1024)} KB (Base64)\n`;
        promptMessage += '- 멀티모달 LLM에 전달 준비 완료\n\n';
        
        // Claude 형식 메시지 예시
        const claudeMessage = this.promptBuilder.formatMultimodalMessage(this.domScanResult, {
          maxElements: 50,
          contextHint: '사용자가 웹 페이지와 상호작용하려고 합니다.',
          screenshotFormat: 'anthropic'
        });
        
        promptMessage += '### Claude API 메시지 형식:\n\n```json\n' + JSON.stringify(claudeMessage, null, 2) + '\n```\n';
      }

      this.messages = [...this.messages, {
        id: generateRandomId(),
        role: 'assistant' as const,
        items: [{
          type: 'markdown' as const,
          value: promptMessage
        }]
      }];

      Toast.success('프롬프트가 생성되었습니다.', {
        title: 'Prompt Generated',
        position: 'top-center',
        duration: 3000,
      });
    } catch (error) {
      console.error('Prompt generation failed:', error);
      Toast.error((error as Error).message, {
        title: 'Generation failed',
        position: 'top-center',
        duration: 5000,
      });
    }
  }

  private formatScanResults(scan: ScanResult): string {
    let md = '# DOM 스캔 결과\n\n';
    md += `**URL**: ${scan.url}\n`;
    md += `**제목**: ${scan.title}\n`;
    md += `**전체 요소**: ${scan.totalElements}개\n`;
    md += `**필터링된 요소**: ${scan.filteredElements}개\n\n`;
    md += '## 인터랙티브 요소\n\n';

    scan.elements.forEach((el, idx) => {
      md += `${idx + 1}. **[${el.id}]** ${el.type} - ${el.tag}\n`;
      if (el.description) md += `   - 설명: ${el.description}\n`;
      if (el.label) md += `   - 레이블: ${el.label}\n`;
      if (el.text) md += `   - 텍스트: ${el.text}\n`;
      if (el.value !== undefined) md += `   - 값: ${el.value}\n`;
      if (el.placeholder) md += `   - Placeholder: ${el.placeholder}\n`;
      md += `   - 위치: (${Math.round(el.x)}, ${Math.round(el.y)})\n`;
      md += `   - 크기: ${Math.round(el.width)}x${Math.round(el.height)}\n`;
      if (el.inShadowDom) md += `   - **Shadow DOM 내부**\n`;
      md += '\n';
    });

    md += '\n## 사용 가능한 명령\n\n';
    md += '- `click(id)`: 요소 클릭\n';
    md += '- `input(id, text)`: 텍스트 입력\n';
    md += '- `select(id, value)`: 옵션 선택\n';
    md += '- `focus(id)`: 포커스 이동\n';
    md += '- `check(id, checked)`: 체크박스 토글\n';

    md += '\n**테스트해보려면 위의 요소 ID를 사용해서 명령을 내려보세요!**\n';

    return md;
  }

  /**
   * 자연어 명령을 DOM 명령으로 변환
   */
  private async parseNaturalLanguageCommand(text: string): Promise<any | null> {
    // DOM 스캔이 필요하면 먼저 스캔
    if (!this.domScanResult) {
      const sandbox = this.shadowRoot?.querySelector('sandbox-app') as any;
      if (!sandbox || !sandbox.shadowRoot) return null;

      this.domScanResult = await this.domAgent.start(sandbox.shadowRoot, {
        maxElements: 50,
        filterStrategy: 'described',
        debug: false
      });
    }

    const elements = this.domScanResult.elements;
    const lowerText = text.toLowerCase();

    // 클릭 명령 처리
    if (lowerText.includes('클릭') || lowerText.includes('click')) {
      for (const elem of elements) {
        if (elem.description && (
          lowerText.includes(elem.description.toLowerCase()) ||
          (elem.text && lowerText.includes(elem.text.toLowerCase()))
        )) {
          return { action: 'click', target: elem.id };
        }
      }
    }

    // 입력 명령 처리
    if (lowerText.includes('입력') || lowerText.includes('input')) {
      // "이메일 입력 필드에 test@test.com 입력" 형식
      const match = lowerText.match(/(.+?)(?:에|에게|에다)?\s*['"]?([^'"]+)['"]?\s*입력/);
      if (match) {
        const fieldName = match[1].trim();
        const value = match[2].trim();
        
        for (const elem of elements) {
          if (elem.type === 'input' && elem.description && elem.description.toLowerCase().includes(fieldName)) {
            return { action: 'input', target: elem.id, value };
          }
        }
      }
    }

    // 선택 명령 처리
    if (lowerText.includes('선택') || lowerText.includes('select')) {
      const match = lowerText.match(/(.+?)(?:에서|을|를)?\s*['"]?([^'"]+)['"]?\s*선택/);
      if (match) {
        const selectName = match[1].trim();
        const value = match[2].trim();
        
        for (const elem of elements) {
          if (elem.type === 'select' && elem.description && elem.description.toLowerCase().includes(selectName)) {
            return { action: 'select', target: elem.id, value };
          }
        }
      }
    }

    // 체크 명령 처리
    if (lowerText.includes('체크') || lowerText.includes('check')) {
      for (const elem of elements) {
        if (elem.type === 'checkbox' && elem.description && lowerText.includes(elem.description.toLowerCase())) {
          return { action: 'check', target: elem.id, value: true };
        }
      }
    }

    return null;
  }

  private async executeCommand(command: any) {
    try {
      console.log('Executing DOM command:', command);
      
      const domCommand: DOMCommand = {
        action: command.action,
        target: command.target,
        value: command.value,
      };

      const result = await this.domAgent.executeAndRescan([domCommand], {
        maxElements: 50,
        filterStrategy: 'described'
      });

      console.log('Execution result:', result);

      // 실행 결과 메시지 생성
      let resultMessage = `## 명령 실행 결과\n\n`;
      
      result.execution.forEach((exec, idx) => {
        resultMessage += `**명령 ${idx + 1}**: ${exec.command.action} → ${exec.command.target}\n`;
        resultMessage += `**상태**: ${exec.success ? '✅ 성공' : '❌ 실패'}\n`;
        if (exec.error) {
          resultMessage += `**에러**: ${exec.error}\n`;
        }
        if (exec.command.value !== undefined) {
          resultMessage += `**값**: ${exec.command.value}\n`;
        }
        resultMessage += '\n';
      });

      resultMessage += `\n**재스캔 완료**: ${result.scan.filteredElements}개 요소 발견\n`;

      // 결과 메시지 추가
      this.messages = [...this.messages, {
        id: generateRandomId(),
        role: 'assistant' as const,
        items: [{
          type: 'markdown' as const,
          value: resultMessage
        }]
      }];

      const firstExec = result.execution[0];
      Toast.show(firstExec.success ? 'success' : 'error', 
        firstExec.success ? `${firstExec.command.action} 실행됨` : firstExec.error || 'Unknown error', {
        title: firstExec.success ? 'Command Executed' : 'Command Failed',
        position: 'top-center',
        duration: 3000,
      });

    } catch (error) {
      console.error('Command execution failed:', error);
      
      this.messages = [...this.messages, {
        id: generateRandomId(),
        role: 'assistant' as const,
        items: [{
          type: 'markdown' as const,
          value: `## ❌ 명령 실행 실패\n\n${(error as Error).message}`
        }]
      }];

      Toast.error((error as Error).message, {
        title: 'Execution failed',
        position: 'top-center',
        duration: 5000,
      });
    }
  }

  /**
   * LLM 자동화 시작
   */
  private handleStartAutomation = async () => {
    if (this.isAutomating) return;

    // 목표 입력 받기
    const goal = prompt('자동화 목표를 입력하세요 (예: "카운터를 10까지 올려주세요")');
    if (!goal) return;

    this.automationGoal = goal;
    this.isAutomating = true;
    this.automationIterations = 0;

    try {
      // 샌드박스 가져오기
      const sandbox = this.shadowRoot?.querySelector('sandbox-app') as any;
      if (!sandbox || !sandbox.shadowRoot) {
        throw new Error('Sandbox not found');
      }

      // 초기 스캔
      const initialScan = await this.domAgent.start(sandbox.shadowRoot, {
        maxElements: 50,
        filterStrategy: 'described',
        includeScreenshot: this.includeScreenshot,
        debug: false
      });

      // 자동화 시작 메시지
      this.messages = [...this.messages, {
        id: generateRandomId(),
        role: 'assistant' as const,
        items: [{
          type: 'markdown' as const,
          value: `## 🤖 자동화 시작\n\n**목표**: ${goal}\n\n초기 스캔 완료: ${initialScan.filteredElements}개 요소 발견`
        }]
      }];

      // DOMAgent automate 호출
      await this.domAgent.automate(
        async (scan) => {
          this.automationIterations++;
          // LLM 콜백
          return await this.llmAutomationCallback(scan, this.automationIterations);
        },
        {
          maxIterations: 10,
          includeScreenshot: this.includeScreenshot
        }
      );

      // 자동화 완료 메시지
      this.messages = [...this.messages, {
        id: generateRandomId(),
        role: 'assistant' as const,
        items: [{
          type: 'markdown' as const,
          value: `## ✅ 자동화 완료\n\n총 ${this.automationIterations}번 반복 실행`
        }]
      }];

      Toast.success(`${this.automationIterations}번 반복 완료`, {
        title: 'Automation Completed',
        position: 'top-center',
        duration: 3000,
      });

    } catch (error) {
      console.error('Automation failed:', error);
      
      this.messages = [...this.messages, {
        id: generateRandomId(),
        role: 'assistant' as const,
        items: [{
          type: 'markdown' as const,
          value: `## ❌ 자동화 실패\n\n${(error as Error).message}`
        }]
      }];

      Toast.error((error as Error).message, {
        title: 'Automation Failed',
        position: 'top-center',
        duration: 5000,
      });
    } finally {
      this.isAutomating = false;
    }
  }

  /**
   * LLM 자동화 콜백 (각 반복마다 호출)
   */
  private async llmAutomationCallback(scan: ScanResult, iteration: number): Promise<DOMCommand[] | null> {
    try {
      // 프롬프트 생성
      const elementsPrompt = this.promptBuilder.buildPrompt(scan.elements, {
        includeInvisible: false,
        maxElements: 30
      });

      const systemPrompt = `당신은 웹 자동화 에이전트입니다. 사용자의 목표를 달성하기 위해 DOM 요소들을 분석하고 적절한 명령을 JSON 배열로 반환하세요.

**목표**: ${this.automationGoal}

**현재 상황**: 
- 반복 횟수: ${iteration}/10
- 발견된 요소: ${scan.filteredElements}개

**응답 형식**:
\`\`\`json
[
  {"action": "click", "target": "elm_xxx"},
  {"action": "input", "target": "elm_yyy", "value": "텍스트"},
  {"action": "select", "target": "elm_zzz", "value": "옵션"}
]
\`\`\`

목표를 달성했거나 더 이상 할 일이 없으면 빈 배열 []을 반환하세요.

${elementsPrompt}`;

      // LLM 호출
      const response = await this.callLLMForAutomation(systemPrompt, scan.screenshot);

      // 명령 추출
      const commands = this.promptBuilder.extractCommands(response);

      // 반복 메시지 추가
      this.messages = [...this.messages, {
        id: generateRandomId(),
        role: 'assistant' as const,
        items: [{
          type: 'markdown' as const,
          value: `### 반복 ${iteration}\n\n**LLM 응답**:\n\`\`\`\n${response}\n\`\`\`\n\n**추출된 명령**: ${commands.length}개`
        }]
      }];

      return commands.length > 0 ? commands : null;

    } catch (error) {
      console.error('LLM callback failed:', error);
      return null;  // 에러 시 자동화 종료
    }
  }

  /**
   * LLM API 호출 (자동화용)
   */
  private async callLLMForAutomation(prompt: string, screenshot?: string): Promise<string> {
    const openai = new (await import('openai')).default({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const messages: any[] = [
      {
        role: 'user',
        content: screenshot
          ? [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:image/png;base64,${screenshot}` } }
            ]
          : prompt
      }
    ];

    const response = await openai.chat.completions.create({
      model: this.model,
      messages: messages,
      temperature: 0.3,  // 일관된 응답을 위해 낮은 온도
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || '';
  }

  // ── 유틸 ──

  private getTextValue(msg: Message): string {
    if (msg.role === 'intent') return '';
    return msg.items
      .filter(item => item.type === 'text' || item.type === 'markdown')
      .map((item: any) => item.value || '')
      .join('\n');
  }

  private scrollToLast() {
    const lastMsg = this.shadowRoot?.querySelector('.messages > :last-child');
    if (!lastMsg) return;
    lastMsg.scrollIntoView({  behavior: 'smooth' });
  }

  static styles = css`
    :host {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    * { 
      box-sizing: border-box; 
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      height: 48px;
      border-bottom: 1px solid var(--u-border-color);
      flex-shrink: 0;
    }
    .header-title {
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.02em;
    }
    .header-actions { 
      display: flex; 
      align-items: center; 
      gap: 2px; 
    }

    .body {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    /* 샌드박스 (왼쪽) */
    .sandbox {
      width: 500px;
      flex-shrink: 0;
      border-right: 2px solid var(--u-border-color);
      background: var(--u-surface-color);
      overflow: hidden;
    }
    .sandbox[hidden] {
      display: none;
    }

    .main {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(100, 100, 100, 0.2) transparent;
    }

    .messages {
      position: relative;
      width: calc(100% - 40px);
      max-width: 760px;
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 40px 0px;
    }
    .messages > :last-child {
      min-height: 100vh;
    }

    u-message { 
      animation: slideIn 0.3s ease-out; 
    }
    u-message + u-message { 
      padding-top: 12px; 
    }
    u-message .msg-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 1.2rem;
      font-weight: 600;
    }
    u-message .msg-header u-icon {
      font-size: 1.5rem;
    }
    u-message .msg-footer {
      margin-top: 6px;
      display: flex;
      align-items: center;
    }

    u-prompt {
      position: sticky;
      z-index: 1000;
      bottom: 20px;
      width: calc(100% - 40px);
      max-width: 760px;
      flex-shrink: 0;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    /* 사이드 패널 */
    .aside-panel {
      position: relative;
      width: 420px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex-shrink: 0;
      padding: 16px;
      border-left: 1px solid var(--u-border-color);
      background: var(--u-panel-bg-color);
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(100, 100, 100, 0.2) transparent;
    }
    .aside-panel[hidden] {
      display: none;
    }

    .instructions {
      border: 1px solid var(--u-border-color);
      border-radius: 6px;
      padding: 10px;
      font-size: 0.75rem;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-x: auto;
      margin: 0;
      max-height: 240px;
      overflow-y: auto;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .field span {
      font-size: 0.8rem;
      font-weight: 500;
    }
    .field-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .field select {
      padding: 6px 8px;
      border: 1px solid var(--u-border-color);
      border-radius: 6px;
      font-size: 0.85rem;
      outline: none;
    }
    .field.row {
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }
    .field.row input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
}
