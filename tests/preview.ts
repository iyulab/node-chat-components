import { LitElement, PropertyValues, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import '../src';
import { Theme, Notifier } from '@iyulab/components';
import { WidgetPromptBuilder } from '../src/utilities/WidgetPromptBuilder.js';
import { ActionPromptBuilder } from '../src/utilities/ActionPromptBuilder.js';
import { PresetWidget } from '../src/types/Widgets.js';
import { PresetAction } from '../src/types/Actions.js';
import type { BlockItem, FileBlockItem } from '../src/types/BlockItem';
import type { Message, AssistantMessage } from './messages';
import { messages } from './messages';
import { generateStreamingMessage, generateRandomId } from './generator';
import type { ResponseOptions } from "./generator";

@customElement('preview-app')
export class PreviewApp extends LitElement {
  private aborter: AbortController = new AbortController();
  private wb = new WidgetPromptBuilder();
  private ab = new ActionPromptBuilder();

  @state() showPanel = false;
  @state() instructions: string = '';
  @state() messages: Message[] = messages;

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
      'You are a helpful AI assistant that can use various widgets and actions to enhance your responses.',
      this.wb.use(PresetWidget.All).build(),
      this.ab.use(PresetAction.All).build(),
    ].join('\n\n');
  }

  protected async updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('messages')) {
      if (this.isUserScrolling) return;
      await this.updateComplete;
      this.scrollToBottom();
    }
  }

  render() {
    return html`
      <!-- 헤더 -->
      <div class="header">
        <span class="header-title">Chat Preview</span>
        <div class="header-actions">
          <u-button variant="borderless" @click=${() => this.showPanel = !this.showPanel}>
            Settings
          </u-button>
          <u-button variant="borderless" @click=${() => this.messages = []}>
            Clear
          </u-button>
          <u-button variant="borderless" @click=${() => Theme.set(Theme.get() === 'dark' ? 'light' : 'dark')}>
            Theme
          </u-button>
        </div>
      </div>

      <!-- 바디 -->
      <div class="body">
        <!-- 채팅룸 -->
        <div class="main" @scroll=${this.handleScroll}>
          <div class="messages">
            ${repeat(this.messages || [], msg => msg.id, msg => 
              msg.role === 'action'
              ? html`
                <u-message variant="default" position="right">
                  ${repeat(msg.items, (_, i) => i, (item: any) => {
                    const props = item.properties || {};
                    return item.type === 'question'
                    ? html`
                      <u-question-action
                        .question=${props.question}
                        .choices=${props.choices}
                        @u-submit=${this.handleSubmit}
                      ></u-question-action>
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

      // action-json 블록이 있는지 파싱하여 action 메시지로 추가
      const markdown = msg?.items
        .filter(item => item.type === 'markdown')
        .map(item => item.value)
        .join('\n') ?? '';
      console.log('Generated markdown:', markdown);
      const [actions, _] = this.ab.parse(markdown);
      if (actions.length > 0) {
        this.messages = [...this.messages, {
          id: generateRandomId(),
          role: 'action' as const,
          items: actions.map(a => ({
            type: a.type,
            properties: a.properties
          })),
        }];
      }
    } catch (error) {
      if (!(error instanceof Error && error.message === 'Request was aborted.')) {
        Notifier.toast({
          type: 'error',
          heading: '메시지 생성 실패',
          content: `오류가 발생했습니다: ${(error as Error).message}`,
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

    // 1. action 메시지 제거
    const messages = this.messages.filter(msg => msg.role !== 'action');

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

  // ── 유틸 ──

  private getTextValue(msg: Message): string {
    if (msg.role === 'action') return '';
    return msg.items
      .filter(item => item.type === 'text' || item.type === 'markdown')
      .map((item: any) => item.value || '')
      .join('\n');
  }

  private scrollToBottom() {
    const main = this.shadowRoot?.querySelector('.main');
    if (!main) return;
    requestAnimationFrame(() => {
      main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
    });
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

    u-message { 
      animation: slideIn 0.3s ease-out; 
    }
    u-message + u-message { 
      margin-top: 12px; 
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
