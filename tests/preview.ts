import { LitElement, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import '../src';
import { theme } from '@iyulab/components/dist/utilities/theme.js';
import type { BlockItem, CitationSource, VoteState } from '../src/components/message/UMessage.types.js';
import type { MessageVariant, MessagePosition } from '../src/components/message/UMessage.component.js';

interface Message {
  id: number;
  variant: MessageVariant;
  position: MessagePosition;
  items: BlockItem[];
  citations?: CitationSource[];
  timestamp: string;
  author: string;
  voteState?: VoteState;
}

@customElement('preview-app')
export class PreviewApp extends LitElement {

  private messageCounter = 0;

  private citations: CitationSource[] = [
    {
      type: 'web',
      url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
      title: 'TypeScript: Everyday Types',
      snippet: 'TypeScript provides several ways to describe the shape of an object.',
      favicon: 'https://www.typescriptlang.org/favicon.ico',
      accessedAt: new Date().toISOString()
    },
    {
      type: 'web',
      url: 'https://lit.dev/docs/components/defining/',
      title: 'Lit - Defining a component',
      snippet: 'Lit components are web components that are easy to define and use.',
      accessedAt: new Date().toISOString()
    },
    {
      type: 'document',
      title: 'Web Components Guide',
      snippet: 'A comprehensive guide to modern web components',
      fileName: 'web-components.pdf',
      fileType: 'pdf',
      pageNumber: 15,
      author: 'John Doe'
    }
  ];

  @state() messages: Message[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    theme.init({
      store: { type: 'localStorage', prefix: 'uui-' },
    });
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>💬 Chat Room</h1>
          <div class="actions">
            <u-button
              @click=${this.handleClearMessages}>
              전체 삭제
            </u-button>
            <u-button 
              @click=${() => theme.set(theme.get() === 'dark' ? 'light' : 'dark')}>
              테마 변경
            </u-button>
          </div>
        </div>
        
        <div class="messages">
          ${this.messages.length === 0 ? html`
              <div class="empty-message">
                <p>메시지를 입력해보세요!</p>
              </div>`
            : repeat(this.messages, msg => msg.id , msg => html`
              <u-message 
                .variant=${msg.variant}
                .position=${msg.position}
                .items=${msg.items}
                .citations=${msg.citations}>
                <div slot="header">
                  ${msg.author === 'User' ? '👤' : '🤖'}
                  ${msg.author}
                </div>
                <div slot="footer">
                  ${msg.variant === 'default' ? html`
                    <u-copy-button
                      .value=${`[${msg.timestamp}] ${msg.author}: ${msg.items.map(i => i.value).join('\n')}`}>
                    </u-copy-button>
                    <u-vote-button
                      .state=${msg.voteState || 'none'}
                      @vote-change=${(e: CustomEvent) => this.handleVoteChange(msg.id, e)}>
                    </u-vote-button>
                    <u-report-button
                      @report=${() => this.handleReport(msg.id)}>
                    </u-report-button>
                    <u-speak-button
                      .text=${this.getMessageText(msg)}
                      @play=${(e: CustomEvent) => this.handleSpeakPlay(msg.id, e)}
                      @pause=${() => this.handleSpeakPause(msg.id)}>
                    </u-speak-button>
                    <u-retry-button
                      @retry=${() => this.handleRetry(msg.id)}>
                    </u-retry-button>
                    <u-share-button
                      .text=${this.getMessageText(msg)}
                      @share=${(e: CustomEvent) => this.handleShare(msg.id, e)}
                      @share-error=${(e: CustomEvent) => this.handleShareError(msg.id, e)}>
                    </u-share-button>
                  ` : nothing}
                </div>
              </u-message>
            `)}
        </div>

        <u-chat-input 
          placeholder="메시지를 입력하세요..."
          @u-submit=${this.handleSendMessage}
          @u-cancel=${this.handleCancelMessage}>
        </u-chat-input>
      </div>
    `;
  }

  private handleClearMessages() {
    this.messages = [];
    this.messageCounter = 0;
  }

  private handleSendMessage = async (e: CustomEvent) => {
    const target = e.target as any;
    const value = e.detail.value;
    if (!value.trim()) return;
    target.loading = true;
    
    // 사용자 메시지 추가
    this.messages = [...this.messages, {
      id: this.messageCounter++,
      variant: 'bubble',
      position: 'right',
      items: [{ type: 'text', value: value }],
      timestamp: new Date().toISOString(),
      author: 'User'
    }];
    
    // 어시스턴트 응답 생성
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.generateRandomMessage();

    target.loading = false;
  }

  private handleCancelMessage = (e: CustomEvent) => {
    console.log('Message input cancelled');
    const target = e.target as any;
    target.value = '';
    target.loading = false;
  }

  private generateRandomMessage() {
    const hasThinking = Math.random() > 0.5;
    const hasTool = Math.random() > 0.5;
    const hasCitations = Math.random() > 0.3;
    
    const items: BlockItem[] = [];
    
    if (hasThinking) {
      items.push({
        type: 'thinking',
        value: '사용자의 질문을 분석하고 있습니다... 관련 문서를 검색해야겠습니다.'
      });
    }
    
    if (hasTool) {
      items.push({
        type: 'tool',
        status: Math.random() > 0.2 ? 'success' : 'failure',
        name: 'search_docs',
        input: JSON.stringify({ query: 'TypeScript interface vs type', limit: 5 }),
        output: JSON.stringify({ 
          results: ['Interface는 확장 가능', 'Type은 유니온 타입 지원'],
          count: 2 
        })
      });
    }
    
    const markdownContent = `## 답변

좋은 질문입니다! 간단히 설명드리겠습니다.

### 주요 특징

1. **첫 번째 포인트**: 기본적인 개념 설명
2. **두 번째 포인트**: 실용적인 예시
3. **세 번째 포인트**: 심화 내용

예시 코드:

\`\`\`typescript
interface Example {
  name: string;
  value: number;
}
\`\`\`

더 자세한 내용은 관련 문서를 참고해주세요.`;
    
    items.push({
      type: 'markdown',
      value: markdownContent,
      citationRefs: hasCitations ? [
        { citationId: 0, startIndex: 50, endIndex: 50 },
        { citationId: 1, startIndex: 150, endIndex: 150 }
      ] : undefined
    });
    
    this.messages = [...this.messages, {
      id: this.messageCounter++,
      variant: 'default',
      position: 'left',
      items,
      citations: hasCitations ? this.citations : undefined,
      timestamp: new Date().toISOString(),
      author: 'Assistant',
      voteState: 'none'
    }];
  }

  private getMessageText = (msg: Message): string => {
    return msg.items
      .filter(item => item.type === 'text' || item.type === 'markdown')
      .map(item => item.value || '')
      .join('\n');
  }

  private handleVoteChange = (messageId: number, e: CustomEvent) => {
    const newState = e.detail.state as VoteState;
    console.log(`Message ${messageId} vote state changed to:`, newState);
    
    this.messages = this.messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, voteState: newState }
        : msg
    );
  }

  private handleReport = (messageId: number) => {
    console.log(`Message ${messageId} reported`);
    alert(`메시지 ${messageId}를 신고했습니다.`);
  }

  private handleSpeakPlay = (messageId: number, e: CustomEvent) => {
    console.log(`Message ${messageId} speak started:`, e.detail.text);
  }

  private handleSpeakPause = (messageId: number) => {
    console.log(`Message ${messageId} speak paused`);
  }

  private handleRetry = (messageId: number) => {
    console.log(`Message ${messageId} retry requested`);
    const messageIndex = this.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
      // 메시지 재생성 로직
      this.messages = this.messages.slice(0, messageIndex);
      this.generateRandomMessage();
    }
  }

  private handleShare = (messageId: number, e: CustomEvent) => {
    console.log(`Message ${messageId} share:`, e.detail);
  }

  private handleShareError = (messageId: number, e: CustomEvent) => {
    console.error(`Message ${messageId} share error:`, e.detail.error);
  }

  static styles = css`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      box-sizing: border-box;
      color: var(--u-txt-color);
      background-color: var(--u-bg-color);
    }

    .container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 2px solid var(--u-border-color);
      flex-shrink: 0;
    }
    .header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .header .actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }

    .messages {
      position: relative;
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 100px;
    }

    .empty-message {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    u-message {
      display: flex;
      animation: slideIn 0.3s ease-out;
    }

    u-chat-input {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 40px);
      max-width: 760px;
      flex-shrink: 0;
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