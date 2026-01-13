import { LitElement, PropertyValues, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import '../src';
import { theme } from '@iyulab/components/dist/utilities/theme.js';
import { type Message, messages } from "./messages";
import { generateMessage } from "./generator";

@customElement('preview-app')
export class PreviewApp extends LitElement {
  private aborter: AbortController = new AbortController();

  @state() messages: Message[] = messages;

  connectedCallback(): void {
    super.connectedCallback();
    theme.init({
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
            <u-button @click=${() => this.messages = []}>
              전체 삭제
            </u-button>
            <u-button @click=${() => theme.set(theme.get() === 'dark' ? 'light' : 'dark')}>
              테마 변경
            </u-button>
          </div>
        </div>
        
        <div class="messages">
          ${this.messages.length > 0
            ? repeat(this.messages, msg => msg.id , msg => msg.role === 'user'
              ? html`
                <u-message variant="bubble" position="right"
                  style="max-width: 80%;"
                  .items=${msg.items}
                  .citations=${msg.citations}>
                  <div class="msg-footer" slot="footer">
                    <u-copy-button
                      .value=${this.getTextValue(msg)}>
                    </u-copy-button>
                  </div>
                </u-message>`
              : html`
                <u-message variant="default" position="left"
                  style="min-width: 80%;"
                  .items=${msg.items}
                  .citations=${msg.citations}>
                  <div class="msg-header" slot="header">
                    🤖 The Assistant
                  </div>
                  <div class="msg-footer" slot="footer">
                    <u-copy-button
                      .value=${this.getTextValue(msg)}>
                    </u-copy-button>
                    <u-retry-button
                      data-id=${msg.id}
                      @click=${this.handleRetryClick}>
                    </u-retry-button>
                    <u-vote-button
                      data-id=${msg.id}
                      .value=${msg.voteValue || 'none'}
                      @u-change=${this.handleVoteChange}>
                    </u-vote-button>
                    <u-share-button
                      data-id=${msg.id}
                      @click=${this.handleShareClick}>
                    </u-share-button>
                    <u-report-button
                      data-id=${msg.id}
                      @click=${this.handleReportClick}>
                    </u-report-button>
                  </div>
                </u-message>`)
            : html`
              <div style="flex:1; display:flex; align-items:center; justify-content:center;">
                <p>메시지를 입력해보세요!</p>
              </div>`}
        </div>

        <u-prompt 
          placeholder="메시지를 입력하세요..."
          @u-submit=${this.handleSubmitMessage}
          @u-cancel=${this.handleCancelMessage}>
          <div slot="left-actions">
            <u-attach-button
              multiple  
              accept="image/*,.pdf,.text/plain"
              @u-change=${this.handleAttachClick}
            ></u-attach-button>
          </div>
        </u-prompt>
      </div>
    `;
  }

  private handleSubmitMessage = async (e: CustomEvent) => {
    const value = e.detail.value;
    if (!value.trim()) return;
    
    // 사용자 메시지 추가
    this.messages = [...this.messages, {
      id: this.messages.length++,
      role: 'user',
      items: [{ type: 'text', value: value }],
    }];
    
    // 어시스턴트 메시지 추가
    this.messages = [...this.messages, {
      id: this.messages.length++,
      role: 'assistant',
      items: [],
    }];

    // 메시지 렌더링 대기
    await this.updateComplete;
    const prompt = this.shadowRoot?.querySelector('u-prompt') as any;
    const lastmsg = this.shadowRoot?.querySelectorAll('u-message')[this.messages.length - 1] as any;

    try {
      // 로딩 상태 시작
      prompt.loading = true;
      lastmsg.loading = true;
      
      // 메시지 생성
      const message = await generateMessage(this.messages, this.aborter.signal);
      this.messages = [...this.messages.slice(0, -1), message];
    } catch (error) {
      if (error instanceof Error && error.message === 'Request was aborted.') {
        // 요청이 중단된 경우
      } else {
        console.error('Message generation failed:', error);
      }
    } finally {
      this.aborter = new AbortController();
      prompt.loading = false;
      lastmsg.loading = false;
    }
  }

  private handleCancelMessage = (e: CustomEvent) => {
    const target = e.target as any;
    this.aborter.abort();
    this.aborter = new AbortController();
    target.loading = false;
  }

  private handleRetryClick = async (event: Event) => {
    const target = event.target as any;
    const messageId = Number(target.getAttribute('data-id'));
    const idx = this.messages.findIndex(msg => msg.id === messageId);
    if (idx < 0) return;

    // 이전 메시지들까지만 남기고 어시스턴트 메시지 제거
    const messages = this.messages.slice(0, idx);
    this.messages = [...messages, {
      id: messages.length,
      role: 'assistant',
      items: []
    }];

    // 메시지 렌더링 대기
    await this.updateComplete;
    const prompt = this.shadowRoot?.querySelector('u-prompt') as any;
    const lastmsg = this.shadowRoot?.querySelectorAll('u-message')[this.messages.length - 1] as any;
    const button = lastmsg?.querySelector('u-retry-button') as any;
    
    try {
      // 로딩 상태 시작
      button.loading = true;
      prompt.loading = true;
      lastmsg.loading = true;

      // 메시지 재생성
      const message = await generateMessage(messages, this.aborter.signal);
      this.messages = [...messages, message];
    } catch (error) {
      if (error instanceof Error && error.message === 'Request was aborted.') {
        // 요청이 중단된 경우
      } else {
        console.error('Retry failed:', error);
      }
    } finally {
      this.aborter = new AbortController();
      button.loading = false;
      prompt.loading = false;
      lastmsg.loading = false;
    }
  }

  private handleVoteChange = (event: CustomEvent) => {
    const target = event.target as any;
    const messageId = Number(target.getAttribute('data-id'));
    
    this.messages.forEach(msg => {
      if (msg.id === messageId) {
        msg.voteValue = event.detail.value;
      }
    });
  }

  private handleShareClick = (event: Event) => {
    const target = event.target as any;
    const messageId = Number(target.getAttribute('data-id'));
    alert(`메시지 ${messageId}를 공유했습니다.`);
  }

  private handleReportClick = (event: Event) => {
    const target = event.target as any;
    const messageId = Number(target.getAttribute('data-id'));
    alert(`메시지 ${messageId}를 신고했습니다.`);
  }
  
  private handleAttachClick = (event: CustomEvent) => {
    const files: File[] = event.detail.files;
    console.log('Attached files:', files);
  }

  private getTextValue = (msg: Message): string => {
    return msg.items
      .filter(item => item.type === 'text' || item.type === 'markdown')
      .map(item => item.value || '')
      .join('\n');
  }

  private scrollToBottom = () => {
    const container = this.shadowRoot?.querySelector('.messages');
    if (!container) return;
    
    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
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

    * {
      box-sizing: border-box;
    }

    .container {
      position: relative;
      width: 100%;
      max-width: 800px;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid var(--u-border-color);
    }
    .header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .header div {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }

    .messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      padding-bottom: 140px;
      overflow-y: auto;
    }

    u-message {
      animation: slideIn 0.3s ease-out;
    }
    u-message + u-message {
      margin-top: 12px;
    }
    u-message .msg-header {
      color: var(--u-neutral-800);
      font-size: 1.25rem;
      font-weight: 500;
      margin-bottom: 6px;
    }
    u-message .msg-footer {
      margin-top: 6px;
      display: flex;
      flex-direction: row;
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
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
}