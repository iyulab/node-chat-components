import { LitElement, PropertyValues, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import '../src';
import { Theme } from '@iyulab/components/dist/utilities/Theme.js';
import { type Message, messages } from "./messages";
import { generateMessage, generateRandomId } from "./generator";
import type { ReferenceSource } from "../src/types/BlockReference";

@customElement('preview-app')
export class PreviewApp extends LitElement {
  private aborter: AbortController = new AbortController();

  @state() messages: Message[] = messages;
  @state() showReferenceDemo: boolean = false;

  // 데모용 참조 데이터
  private demoReferences: ReferenceSource[] = [
    {
      type: 'web',
      url: 'https://developer.mozilla.org/ko/docs/Web/JavaScript',
      title: 'JavaScript - MDN Web Docs',
      snippet: 'JavaScript는 프로토타입 기반의 동적 스크립트 언어입니다. 객체지향, 명령형, 선언형(함수형 프로그래밍) 스타일을 지원합니다.',
      favicon: 'https://developer.mozilla.org/favicon.ico'
    },
    {
      type: 'web',
      url: 'https://www.typescriptlang.org/',
      title: 'TypeScript: JavaScript With Syntax For Types',
      snippet: 'TypeScript extends JavaScript by adding types to the language. TypeScript speeds up your development experience.',
      favicon: 'https://www.typescriptlang.org/favicon.ico'
    },
    {
      type: 'document',
      fileName: 'project-guide.pdf',
      contentType: 'application/pdf',
      section: '3장. 아키텍처 설계',
      snippet: '시스템 아키텍처는 마이크로서비스 패턴을 기반으로 설계되었으며, 각 서비스는 독립적으로 배포 가능합니다.',
      score: '0.95',
      url: 'https://example.com/docs/project-guide.pdf'
    }
  ];

  connectedCallback(): void {
    super.connectedCallback();
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
            <u-button @click=${() => this.messages = []}>
              전체 삭제
            </u-button>
            <u-button @click=${() => this.showReferenceDemo = !this.showReferenceDemo}>
              ${this.showReferenceDemo ? '채팅 보기' : '참조 카드 보기'}
            </u-button>
            <u-button @click=${() => Theme.set(Theme.get() === 'dark' ? 'light' : 'dark')}>
              테마 변경
            </u-button>
          </div>
        </div>
        
        ${this.showReferenceDemo ? this.renderReferenceDemo() : this.renderMessages()}

        ${!this.showReferenceDemo ? html`
          <u-prompt 
            placeholder="메시지를 입력하세요..."
            @u-submit=${this.handleSubmitMessage}
            @u-cancel=${this.handleCancelMessage}>
            <div slot="left-actions">
              <u-attach-button
                multiple  
                accept="image/*,.pdf,.text/plain"
                @u-change=${this.handleAttachClick}>
                파일 첨부
              </u-attach-button>
            </div>
          </u-prompt>
        ` : ''}
      </div>
    `;
  }

  private renderMessages() {
    return html`
      <div class="messages">
        ${this.messages.length > 0
            ? repeat(this.messages, msg => msg.id , msg => msg.role === 'user'
              ? html`
                <u-message variant="bubble" position="right"
                  .items=${msg.items}>
                  <div class="msg-footer" slot="footer">
                    <u-copy-button
                      .value=${this.getTextValue(msg)}>
                      텍스트 복사
                    </u-copy-button>
                  </div>
                </u-message>`
              : html`
                <u-message variant="default" position="left"
                  .items=${msg.items}>
                  <div class="msg-header" slot="header">
                    🤖 The Assistant
                  </div>
                  <div class="msg-footer" slot="footer">
                    <u-copy-button
                      .value=${this.getTextValue(msg)}>
                      텍스트 복사
                    </u-copy-button>
                    <u-retry-button
                      data-id=${msg.id}
                      @click=${this.handleRetryClick}>
                      다시 시도
                    </u-retry-button>
                    <u-vote-button
                      data-id=${msg.id}
                      .value=${msg.voteValue || 'none'}
                      @u-change=${this.handleVoteChange}>
                      응답 평가
                    </u-vote-button>
                    <u-share-button
                      data-id=${msg.id}
                      @click=${this.handleShareClick}>
                      공유 하기
                    </u-share-button>
                    <u-report-button
                      data-id=${msg.id}
                      @click=${this.handleReportClick}>
                      신고 하기
                    </u-report-button>
                  </div>
                </u-message>`)
            : html`
              <div style="flex:1; display:flex; align-items:center; justify-content:center;">
                <p>메시지를 입력해보세요!</p>
              </div>`}
      </div>
    `;
  }

  private renderReferenceDemo() {
    return html`
      <div class="reference-demo">
        <h2>📚 참조 카드 컴포넌트 데모</h2>
        
        <section class="demo-section">
          <h3>1. 웹 참조 카드</h3>
          <p class="description">
            type="web" + image(favicon) + href + heading + snippet + tags
          </p>
          <div class="card-container">
            <u-ref-card
              type="web"
              heading="JavaScript - MDN Web Docs"
              image="https://developer.mozilla.org/favicon.ico"
              href="https://developer.mozilla.org/ko/docs/Web/JavaScript"
              .tags=${['developer.mozilla.org', 'JavaScript', 'Programming']}>
              JavaScript는 프로토타입 기반의 동적 스크립트 언어입니다. 객체지향, 명령형, 선언형(함수형 프로그래밍) 스타일을 지원합니다.
            </u-ref-card>
          </div>
        </section>

        <section class="demo-section">
          <h3>2. 웹 참조 카드 - 아이콘만</h3>
          <p class="description">
            type="web" + icon + href (image 없이 icon 사용)
          </p>
          <div class="card-container">
            <u-ref-card
              type="web"
              heading="TypeScript: JavaScript With Syntax For Types"
              icon="code-square"
              href="https://www.typescriptlang.org/"
              .tags=${['typescriptlang.org', 'TypeScript']}>
              TypeScript extends JavaScript by adding types to the language.
            </u-ref-card>
          </div>
        </section>

        <section class="demo-section">
          <h3>3. 문서 참조 카드</h3>
          <p class="description">
            type="document" + heading + snippet + tags
          </p>
          <div class="card-container">
            <u-ref-card
              type="document"
              heading="project-guide.pdf"
              href="https://example.com/docs/project-guide.pdf"
              .tags=${['PDF', '섬션: 3장. 아키텍처 설계', '관련성: 0.95']}>
              시스템 아키텍처는 마이크로서비스 패턴을 기반으로 설계되었으며, 각 서비스는 독립적으로 배포 가능합니다.
            </u-ref-card>
          </div>
        </section>

        <section class="demo-section">
          <h3>4. 참조 카드 그룹 (페이지네이션)</h3>
          <p class="description">
            좌우 화살표로 각 카드를 탐색할 수 있습니다. slot으로 u-ref-card를 주입합니다.
          </p>
          <div class="card-container">
            <u-ref-card-group>
              <u-ref-card
                type="web"
                heading="JavaScript - MDN Web Docs"
                image="https://developer.mozilla.org/favicon.ico"
                href="https://developer.mozilla.org/ko/docs/Web/JavaScript"
                .tags=${['developer.mozilla.org']}>
                JavaScript는 프로토타입 기반의 동적 스크립트 언어입니다.
              </u-ref-card>
              
              <u-ref-card
                type="web"
                heading="TypeScript"
                icon="code-square"
                href="https://www.typescriptlang.org/"
                .tags=${['typescriptlang.org']}>
                TypeScript extends JavaScript by adding types.
              </u-ref-card>
              
              <u-ref-card
                type="document"
                heading="project-guide.pdf"
                href="https://example.com/docs/project-guide.pdf"
                .tags=${['PDF', '섬션: 3장', '관련성: 0.95']}>
                마이크로서비스 패턴 기반 아키텍처 설계
              </u-ref-card>
            </u-ref-card-group>
          </div>
        </section>

        <section class="demo-section">
          <h3>5. 실제 사용 예시</h3>
          <p class="description">
            URefTag 툴팁 내부에 URefCardGroup을 배치하는 방법
          </p>
          <div class="usage-example">
            <code>
&lt;u-ref-tag&gt;<br/>
  &nbsp;&nbsp;&lt;u-tooltip slot="tooltip"&gt;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;u-ref-card-group&gt;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;u-ref-card type="web" heading="..."
&nbsp;href="..."&gt;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;콘텐츠...<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/u-ref-card&gt;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;u-ref-card type="document" heading="..."
&gt;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;콘텐츠...<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/u-ref-card&gt;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;/u-ref-card-group&gt;<br/>
  &nbsp;&nbsp;&lt;/u-tooltip&gt;<br/>
  &nbsp;&nbsp;[1]<br/>
&lt;/u-ref-tag&gt;
            </code>
          </div>
        </section>
      </div>
    `;
  }

  private handleSubmitMessage = async (e: CustomEvent) => {
    const value = e.detail.value;
    if (!value.trim()) return;
    
    // 사용자 및 어시스턴트 메시지 추가
    this.messages = [...this.messages, {
      id: generateRandomId(),
      role: 'user',
      items: [{ type: 'text', value: value }],
    }, {
      id: generateRandomId(),
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
      const messages = this.messages.slice(0, -1); // 마지막 어시스턴트 메시지 제외
      const message = await generateMessage(messages, this.aborter.signal);
      this.messages = [...messages, message];
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
    const messageId = target.getAttribute('data-id');
    const idx = this.messages.findIndex(msg => msg.id === messageId);
    if (idx < 0) return;

    // 이전 메시지들까지만 남기고 어시스턴트 메시지 제거
    const messages = this.messages.slice(0, idx);
    this.messages = [...messages, {
      id: generateRandomId(),
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
    const messageId = target.getAttribute('data-id');
    
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
      overflow: hidden;
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
      padding-bottom: 180px;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(100, 100, 100, 0.2) transparent;
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

    .reference-demo {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }

    .reference-demo h2 {
      margin: 0 0 24px 0;
      color: var(--u-color-text);
    }

    .demo-section {
      margin-bottom: 32px;
      padding: 20px;
      background: var(--u-color-surface-secondary);
      border-radius: var(--u-border-radius-medium);
    }

    .demo-section h3 {
      margin: 0 0 12px 0;
      color: var(--u-color-text);
      font-size: 1.1rem;
    }

    .description {
      margin: 0 0 16px 0;
      color: var(--u-color-text-secondary);
      font-size: 0.9rem;
    }

    .card-container {
      display: flex;
      justify-content: center;
      padding: 16px;
      background: var(--u-color-surface);
      border-radius: var(--u-border-radius-medium);
      border: 1px solid var(--u-color-border);
    }

    .usage-example {
      background: var(--u-color-surface);
      padding: 16px;
      border-radius: var(--u-border-radius-medium);
      border: 1px solid var(--u-color-border);
    }

    .usage-example code {
      display: block;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      color: var(--u-color-text);
      line-height: 1.6;
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