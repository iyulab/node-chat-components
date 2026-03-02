import { LitElement, PropertyValues, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import '../src';
import { Theme } from '@iyulab/components';
import { WidgetPromptBuilder } from '../src/utilities/WidgetPromptBuilder.js';
import { ActionPromptBuilder } from '../src/utilities/ActionPromptBuilder.js';
import { PresetWidget } from '../src/types/Widgets.js';
import { PresetAction } from '../src/types/Actions.js';
import type { BlockItem } from '../src/types/BlockItem';
import type { Message, AssistantMessage } from './messages';
import { messages } from './messages';
import { generateStreamingMessage, generateRandomId } from "./generator";

@customElement('preview-app')
export class PreviewApp extends LitElement {
  private aborter: AbortController = new AbortController();
  private wb = new WidgetPromptBuilder();
  private ab = new ActionPromptBuilder();

  @state() showInstructions = false;
  @state() instructions: string = '';
  @state() messages: Message[] = messages;

  connectedCallback(): void {
    super.connectedCallback();
    
    // Theme 초기화 (선택적으로 브라우저 스토리지 사용)
    Theme.init({
      store: { type: 'localStorage', prefix: 'uui-' },
    });

    // 테스트용으로 모든 프리셋 위젯/액션 등록
    this.wb.use(PresetWidget.All);
    this.ab.use(PresetAction.All);

    // 시스템 프롬프트에 사용할 instruction 빌드
    this.instructions = [
      this.wb.build(),
      this.ab.build(),
    ].join('\n\n');
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('messages')) {
      this.scrollToBottom();
    }
  }

  render() {
    return html`
      <div class="container">
        <!-- 헤더 영역 -->
        <div class="header">
          <h1>💬 Chat Room</h1>
          <div>
            <u-button @click=${() => this.showInstructions = !this.showInstructions}>
              📋 Instructions
            </u-button>
            <u-button @click=${() => this.messages = []}>
              전체 삭제
            </u-button>
            <u-button @click=${() => Theme.set(Theme.get() === 'dark' ? 'light' : 'dark')}>
              테마 변경
            </u-button>
          </div>
        </div>

        <!-- LLM Instructions 패널 -->
        <div class="instructions-panel" ?hidden=${!this.showInstructions}>
          <div class="instructions-header">
            <h3>LLM Instructions</h3>
            <div>
              <u-copy-button .value=${this.instructions}>
                복사
              </u-copy-button>
              <u-button @click=${() => this.showInstructions = false}>
                닫기
              </u-button>
            </div>
          </div>
          <pre class="instructions-content">${this.instructions}</pre>
        </div>

        <!-- 메시지 영역 -->
        <div class="messages">
          ${this.messages.length > 0
            ? repeat(this.messages, msg => msg.id, msg => 
              msg.role === 'user'
              ? html`
                <u-message variant="bubble" position="right">
                  ${this.renderUserBlocks(msg.items)}
                  <div class="msg-footer" slot="footer">
                    <u-copy-button .value=${this.getTextValue(msg)}>
                      텍스트 복사
                    </u-copy-button>
                  </div>
                </u-message>`
              : msg.role === 'action'
              ? html`
                <u-message variant="default" position="right">
                  ${this.renderActionBlock(msg.items)}
                </u-message>`
              : msg.role === 'assistant'
              ? html`
                <u-message variant="default" position="left" style="width: 100%;">
                  <div class="msg-header" slot="header">🤖 The Assistant</div>
                  ${this.renderAssistantBlocks(msg.items)}
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
              : nothing)
            : html`<div class="empty"><p>메시지를 입력해보세요!</p></div>`}
        </div>

        <!-- 프롬프트 영역 -->
        <u-prompt
          placeholder="메시지를 입력하세요..."
          @u-submit=${this.handleSubmit}
          @u-cancel=${this.handleCancel}>
          <div slot="left-actions">
            <u-attach-button multiple accept="image/*,.pdf,.text/plain"
              @u-change=${(e: CustomEvent) => console.log('Attached files:', e.detail.files)}>
              파일 첨부
            </u-attach-button>
          </div>
        </u-prompt>
      </div>
    `;
  }

  private renderUserBlocks(items: BlockItem[]) {
    return items.map(item =>
      item.type === 'text' 
      ? html`
        <u-text-block 
        .value=${item.value}
        ></u-text-block>`
      : item.type === 'files' ? 
      html`
        <u-files-block 
          removable
          .files=${item.files}
        ></u-files-block>`
      : nothing
    );
  }

  private renderAssistantBlocks(items: BlockItem[]) {
    return items.map(item =>
      item.type === 'markdown' 
      ? html`
        <u-marked-block 
          .value=${item.value} 
          .refs=${item.refs}
        ></u-marked-block>`
      : item.type === 'thinking' 
      ? html`
        <u-think-block 
          .value=${item.value}
        ></u-think-block>`
      : item.type === 'tool' ? 
      html`
        <u-tool-block 
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
    );
  }

  private renderActionBlock(items: any) {
    return items.map((item: any) => {
      const props = item.properties || {};
      return item.type === 'question' 
      ? html` 
        <u-question-action 
          .question=${props.question} 
          .choices=${props.choices}
          @u-submit=${this.handleSubmit}
        ></u-question-action>
      ` : nothing
    });
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
      const stream = generateStreamingMessage(messages, this.instructions, this.aborter.signal);
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
      console.log('Parsed actions:', actions);
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
    const value = e.detail.value;
    if (!value.trim()) return;

    // 1. action 메시지 제거
    const messages = this.messages.filter(msg => msg.role !== 'action');

    // 2. user 메시지 추가
    this.messages = [...messages, {
      id: generateRandomId(),
      role: 'user' as const,
      items: [{ type: 'text' as const, value }],
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

  // ── 유틸 ──

  private getTextValue(msg: Message): string {
    if (msg.role === 'action') return '';
    return msg.items
      .filter(item => item.type === 'text' || item.type === 'markdown')
      .map((item: any) => item.value || '')
      .join('\n');
  }

  private scrollToBottom() {
    const container = this.shadowRoot?.querySelector('.messages');
    if (!container) return;
    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });
  }

  static styles = css`
    :host {
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    * { box-sizing: border-box; }

    .container {
      position: relative;
      width: 100%;
      max-width: 800px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid var(--u-border-color);
    }
    .header h1 { margin: 0; font-size: 1.5rem; font-weight: 600; }
    .header div { display: flex; align-items: center; gap: 10px; }

    .instructions-panel {
      border-bottom: 1px solid var(--u-border-color);
      background: var(--u-background-secondary);
      padding: 20px;
      max-height: 400px;
      overflow-y: auto;
    }
    .instructions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .instructions-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; }
    .instructions-header div { display: flex; gap: 8px; }
    .instructions-content {
      background: var(--u-background);
      border: 1px solid var(--u-border-color);
      border-radius: 8px;
      padding: 16px;
      font-size: 0.875rem;
      line-height: 1.6;
      white-space: pre-wrap;
      overflow-x: auto;
      margin: 0;
    }
    .instructions-note {
      margin: 12px 0 0 0;
      font-size: 0.875rem;
      color: var(--u-text-secondary);
    }

    .messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      padding-bottom: 180px;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(100, 100, 100, 0.2) transparent;
    }
    .empty {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    u-message { animation: slideIn 0.3s ease-out; }
    u-message + u-message { margin-top: 12px; }
    u-message .msg-header {
      color: var(--u-neutral-800);
      font-size: 1.25rem;
      font-weight: 500;
      margin-bottom: 6px;
    }
    u-message .msg-footer {
      margin-top: 6px;
      display: flex;
      align-items: center;
    }

    u-prompt {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 40px);
      max-width: 760px;
      flex-shrink: 0;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
}
