import { LitElement, PropertyValues, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import '../src';
import { Theme } from '@iyulab/components';
import { WidgetRegistry } from '../src/utilities/WidgetRegistry.js';
import { ActionRegistry, PresetAction } from '../src/utilities/ActionRegistry.js';
import { PresetWidget } from '../src/types/Widgets.js';
import type { BlockItem } from '../src/types/BlockItem';
import { type Message, type ActionMessage, messages } from "./messages";
import { generateMessageStream, generateRandomId } from "./generator";

@customElement('preview-app')
export class PreviewApp extends LitElement {
  private aborter: AbortController = new AbortController();

  @state() messages: Message[] = messages;
  @state() showInstructions = false;

  connectedCallback(): void {
    super.connectedCallback();
    // 테스트용으로 모든 프리셋 위젯/액션 등록
    WidgetRegistry.use(PresetWidget.All);
    ActionRegistry.use(PresetAction.All);
    // Theme 초기화 (선택적으로 브라우저 스토리지 사용)
    Theme.init({
      store: { type: 'localStorage', prefix: 'uui-' },
    });
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
        <div class="header">
          <h1>💬 Chat Room</h1>
          <div>
            <u-button @click=${() => this.showInstructions = !this.showInstructions}>
              📋 Widget Instructions
            </u-button>
            <u-button @click=${() => this.messages = []}>전체 삭제</u-button>
            <u-button @click=${() => Theme.set(Theme.get() === 'dark' ? 'light' : 'dark')}>
              테마 변경
            </u-button>
          </div>
        </div>

        ${this.showInstructions ? html`
          <div class="instructions-panel">
            <div class="instructions-header">
              <h3>LLM Widget Instructions</h3>
              <div>
                <u-copy-button .value=${WidgetRegistry.buildPrompt() + '\n\n' + ActionRegistry.buildPrompt()}>복사</u-copy-button>
                <u-button @click=${() => this.showInstructions = false}>닫기</u-button>
              </div>
            </div>
            <pre class="instructions-content">${WidgetRegistry.buildPrompt()}

${ActionRegistry.buildPrompt()}</pre>
            <p class="instructions-note">
              💡 위 instruction을 LLM 시스템 프롬프트에 추가하면 위젯과 액션을 사용할 수 있습니다.
            </p>
          </div>
        ` : nothing}

        <div class="messages">
          ${this.messages.length > 0
            ? repeat(this.messages, msg => msg.id, msg => msg.role === 'user'
              ? html`
                <u-message variant="bubble" position="right">
                  ${this.renderBlocks(msg.items)}
                  <div class="msg-footer" slot="footer">
                    <u-copy-button .value=${this.getTextValue(msg)}>텍스트 복사</u-copy-button>
                  </div>
                </u-message>`
              : msg.role === 'action'
              ? html`
                <u-message variant="bubble" position="right">
                  ${this.renderActionItems((msg as ActionMessage).items, msg.id)}
                </u-message>`
              : html`
                <u-message variant="default" position="left">
                  <div class="msg-header" slot="header">🤖 The Assistant</div>
                  ${this.renderBlocks(msg.items)}
                  <div class="msg-footer" slot="footer">
                    <u-copy-button .value=${this.getTextValue(msg)}>텍스트 복사</u-copy-button>
                    <u-retry-button data-id=${msg.id} @click=${this.handleRetry}>다시 시도</u-retry-button>
                    <u-vote-button data-id=${msg.id}
                      .value=${(msg as any).voteValue || 'none'}
                      @u-change=${this.handleVote}>응답 평가</u-vote-button>
                    <u-share-button data-id=${msg.id} @click=${this.handleShare}>공유 하기</u-share-button>
                    <u-report-button data-id=${msg.id} @click=${this.handleReport}>신고 하기</u-report-button>
                  </div>
                </u-message>`)
            : html`<div class="empty"><p>메시지를 입력해보세요!</p></div>`}
        </div>

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

  private renderBlocks(items: BlockItem[]) {
    return items.map(item =>
      item.type === 'text' ? html`<u-text-block .value=${item.value}></u-text-block>`
      : item.type === 'markdown' ? html`<u-marked-block .value=${item.value} .refs=${item.refs}></u-marked-block>`
      : item.type === 'thinking' ? html`<u-think-block .value=${item.value}></u-think-block>`
      : item.type === 'tool' ? html`<u-tool-block .heading=${item.title} .input=${item.input} .output=${item.output}></u-tool-block>`
      : item.type === 'reference' ? html`<u-ref-block heading="References" .sources=${item.sources}></u-ref-block>`
      : nothing
    );
  }

  private renderActionItems(items: ActionMessage['items'], actionMsgId: string) {
    return items.map(item =>
      item.type === 'questions'
        ? html`<u-questions-block
            .values=${item.values}
            @query=${(e: CustomEvent) => this.handleQuery(e, actionMsgId)}>
          </u-questions-block>`
        : nothing
    );
  }

  // ── 이벤트 핸들러 ──

  private handleQuery = async (e: CustomEvent, actionMsgId: string) => {
    const { value } = e.detail;
    if (!value?.trim()) return;

    // 1. action 메시지 제거
    const withoutAction = this.messages.filter(m => m.id !== actionMsgId);

    // 2. user 텍스트 메시지 추가
    const nextMessages = [...withoutAction, {
      id: generateRandomId(),
      role: 'user' as const,
      items: [{ type: 'text' as const, value }],
    }];
    this.messages = nextMessages;

    await this.updateComplete;
    const prompt = this.shadowRoot?.querySelector('u-prompt') as any;

    try {
      if (prompt) prompt.loading = true;
      await this.streamAssistant(nextMessages);
    } catch (error) {
      if (!(error instanceof Error && error.message === 'Request was aborted.')) {
        console.error('Query failed:', error);
      }
    } finally {
      this.aborter = new AbortController();
      if (prompt) prompt.loading = false;
    }
  }

  private handleSubmit = async (e: CustomEvent) => {
    const value = e.detail.value;
    if (!value.trim()) return;

    const userMessages = [...this.messages, {
      id: generateRandomId(),
      role: 'user' as const,
      items: [{ type: 'text' as const, value }],
    }];
    this.messages = userMessages;

    await this.updateComplete;
    const prompt = this.shadowRoot?.querySelector('u-prompt') as any;

    try {
      prompt.loading = true;
      await this.streamAssistant(userMessages);
    } catch (error) {
      if (!(error instanceof Error && error.message === 'Request was aborted.')) {
        console.error('Message generation failed:', error);
      }
    } finally {
      this.aborter = new AbortController();
      prompt.loading = false;
    }
  }

  private handleCancel = () => {
    this.aborter.abort();
    this.aborter = new AbortController();
    const prompt = this.shadowRoot?.querySelector('u-prompt') as any;
    if (prompt) prompt.loading = false;
  }

  private handleRetry = async (e: Event) => {
    const id = (e.target as HTMLElement).getAttribute('data-id');
    const idx = this.messages.findIndex(msg => msg.id === id);
    if (idx < 0) return;

    const prev = this.messages.slice(0, idx);
    this.messages = prev;

    await this.updateComplete;
    const prompt = this.shadowRoot?.querySelector('u-prompt') as any;

    try {
      prompt.loading = true;
      await this.streamAssistant(prev);
    } catch (error) {
      if (!(error instanceof Error && error.message === 'Request was aborted.')) {
        console.error('Retry failed:', error);
      }
    } finally {
      this.aborter = new AbortController();
      prompt.loading = false;
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

  // ── 유틸 ──

  private async streamAssistant(userMessages: Message[]) {
    const stream = generateMessageStream(userMessages, this.aborter.signal);
    for await (const message of stream) {
      this.messages = [...userMessages, message];
      this.requestUpdate();
    }
    await this.updateComplete;

    // 스트리밍 완료 → action-json 블록 추출 및 action 메시지 생성
    const lastMsg = this.messages[this.messages.length - 1];
    if (lastMsg?.role === 'assistant') {
      const markdownItem = lastMsg.items.find(i => i.type === 'markdown') as any;
      if (markdownItem?.value) {
        console.log('[ActionRegistry] extractPrompt input:', markdownItem.value);
        const [clean, actions] = ActionRegistry.extractPrompt(markdownItem.value);
        console.log('[ActionRegistry] extracted actions:', actions);
        if (actions.length > 0) {
          markdownItem.value = clean;
          this.messages = [
            ...this.messages,
            {
              id: generateRandomId(),
              role: 'action' as const,
              items: actions,
            }
          ];
        }
      }
    }

    const lastmsg = this.shadowRoot?.querySelectorAll('u-message')[this.messages.length - 1] as any;
    if (lastmsg) lastmsg.loading = false;
  }

  private getTextValue(msg: Message): string {
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

  // ── 스타일 ──

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
