import { LitElement, PropertyValues, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import '../src';
import '../src/extras.js';
import { Theme, Toast } from '@iyulab/components';
import { ExtraPromptBuilder } from '../src/utilities/ExtraPromptBuilder.js';
import { PresetExtra } from '../src/types/Extras.js';
import type { BlockItem } from '../src/types/BlockItem';
import type { Message } from './messages';
import { messages } from './messages';
import { generateStreamingMessage, generateRandomId } from './generator';
import type { ResponseOptions } from "./generator";
import './sandbox.js';
import { DOMAgent, DOMPromptBuilder } from '../src/utilities/dom-agent/index.js';
import type { ScanResult } from '../src/utilities/dom-agent/index.js';
import { SendEvent, UPrompt } from "../src";

@customElement('preview-app')
export class PreviewApp extends LitElement {
  private aborter: AbortController = new AbortController();
  private eb = new ExtraPromptBuilder();
  private db = new DOMPromptBuilder();
  private domAgent = new DOMAgent();

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

  connectedCallback(): void {
    super.connectedCallback();

    // Theme 초기화 (선택적으로 브라우저 스토리지 사용)
    Theme.init({
      store: { type: 'localStorage', prefix: 'uui-' },
    });

    // 시스템 프롬프트에 사용할 instruction 빌드
    this.instructions = [
      'You are a helpful AI assistant that can use various blocks to enhance your responses.',
      this.eb.use(PresetExtra.All).build(),
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
              msg.role === 'user'
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
                    <u-icon-button lib="tabler" name="refresh" variant="ghost"
                      data-id=${msg.id} 
                      @click=${this.handleRetryClick}>
                      다시 시도
                    </u-icon-button>
                    <u-icon-button lib="tabler" name="share" variant="ghost" 
                      data-id=${msg.id} 
                      @click=${this.handleShareClick}>
                      공유 하기
                    </u-icon-button>
                    <u-icon-button lib="tabler" name="flag" variant="ghost" 
                      data-id=${msg.id} 
                      @click=${this.handleReportClick}>
                      신고 하기
                    </u-icon-button>
                  </div>
                </u-message>`
              : nothing)}
          </div>

          <u-prompt
            placeholder="메시지를 입력하세요..."
            @remove=${(e: any) => console.log('Removed file:', e.target.file)}
            @send=${this.handlePromptSend}
            @stop=${this.handlePromptStop}>
          </u-prompt>
        </div>

        <!-- 사이드 패널 -->
        <aside class="aside-panel" ?hidden=${!this.showPanel}>
          <u-select label="Model" .value=${this.model as any}
            @change=${(e: any) => this.model = e.target.value}>
            <u-option value="gpt-5.2">gpt-5.2</u-option>
            <u-option value="gpt-5.2-pro">gpt-5.2-pro</u-option>
            <u-option value="gpt-5-mini">gpt-5-mini</u-option>
            <u-option value="gpt-5-nano">gpt-5-nano</u-option>
          </u-select>

          <u-textarea 
            label="System Instructions"
            resize="none"
            min-rows=8
            .value=${this.instructions as any}
            @change=${(e: any) => this.instructions = e.target.value}
          ></u-textarea>

          <u-select label="Reasoning Effort" .value=${this.reasoningEffort as any}
            @change=${(e: any) => this.reasoningEffort = e.target.value}>
            <u-option value="none">none</u-option>
            <u-option value="minimal">minimal</u-option>
            <u-option value="low">low</u-option>
            <u-option value="medium">medium</u-option>
            <u-option value="high">high</u-option>
            <u-option value="xhigh">xhigh</u-option>
          </u-select>

          <label class="field">
            <span>Tools</span>
            <u-checkbox
              .checked=${this.webSearch}
              @change=${(e: any) => this.webSearch = e.target.checked}>
              Web Search
            </u-checkbox>
            <u-checkbox disabled checked
              @change=${(e: any) => this.isAutomating = e.target.checked}>
              Code Execution (coming soon)
            </u-checkbox>
            <u-checkbox disabled checked
              @change=${(e: any) => this.isAutomating = e.target.checked}>
              Image Generation (coming soon)
            </u-checkbox>
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
      for await (const msg of stream) {
        this.messages = [...this.messages.slice(0, -1), msg];
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

  private handlePromptSend = async (e: SendEvent) => {
    const target = e.target as UPrompt;
    const value = target.value || '';
    const files = target.files || [];
    if (!value.trim() && (!files || files.length === 0)) return;
    target.value = '';
    target.files = [];

    // 1. user 메시지에 텍스트 + 파일 추가
    const items = [] as BlockItem[];
    if (value.trim()) {
      items.push({ type: 'text', value });
    }
    if (files && files.length > 0) {
      items.push(...files);
    }

    // 2. user 메시지 추가
    this.messages = [...this.messages, {
      id: generateRandomId(),
      role: 'user' as const,
      items: items,
    }];
    await this.updateComplete;
    await this.generate();
  }

  private handlePromptStop = () => {
    this.aborter.abort();
    this.aborter = new AbortController();
    this.loading(false);
  }

  private handleRetryClick = async (e: Event) => {
    const id = (e.target as HTMLElement).getAttribute('data-id');
    const idx = this.messages.findIndex(msg => msg.id === id);
    if (idx < 0) return;

    const prev = this.messages.slice(0, idx);
    this.messages = prev;

    await this.updateComplete;
    await this.generate();
  }

  private handleShareClick = (e: Event) => {
    const id = (e.target as HTMLElement).getAttribute('data-id');
    alert(`메시지 ${id}를 공유했습니다.`);
  }

  private handleReportClick = (e: Event) => {
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

      // DOM 스캔 (샌드박스 Shadow DOM을 루트로 지정)
      const scan = await this.domAgent.start(scanRoot, {
        maxElements: 50,
        filterStrategy: 'described',
        includeScreenshot: this.includeScreenshot,
        debug: false  // 디버그 로그 활성화하려면 true로 변경
      });

      // 스캔 결과를 콘솔에 추가
      const scanMessage = this.formatScanResults(scan);
      console.log('[DEBUG] Scan Message:', scanMessage);

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

  // ── 유틸 ──

  private getTextValue(msg: Message): string {
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

    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .field span {
      font-size: 0.8rem;
      font-weight: 500;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
}
