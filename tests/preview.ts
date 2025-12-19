import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

import '../src';
import { theme } from '@iyulab/components/dist/utilities/theme.js';
import "@iyulab/components/dist/components/button/UButton.js";
import type { BlockItem } from '../src/components/message/UMessage.types.js';

@customElement('preview-app')
export class PreviewApp extends LitElement {

  private messageItems: BlockItem[] = [
    {
      type: 'thinking',
      value: '사용자가 TypeScript에서 인터페이스와 타입의 차이를 물었습니다. 두 개념의 차이점과 각각의 사용 사례를 설명해야 합니다.'
    },
    {
      type: 'tool',
      status: 'success',
      name: 'search_docs',
      input: JSON.stringify({ query: 'TypeScript interface vs type' }),
      output: JSON.stringify({ results: ['Interface는 확장 가능', 'Type은 유니온 타입 지원'] })
    },
    {
      type: 'markdown',
      value: `## TypeScript: Interface vs Type

TypeScript에서 **interface**와 **type**은 비슷해 보이지만 몇 가지 중요한 차이점이 있습니다.

### Interface

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

// 확장 가능
interface Admin extends User {
  role: string;
}
\`\`\`

### Type

\`\`\`typescript
type User = {
  name: string;
  age: number;
};

// 유니온 타입 지원
type Status = 'active' | 'inactive';
\`\`\`

> **Tip**
> 일반적으로 객체 타입은 interface를, 유니온이나 복잡한 타입은 type을 사용하세요.`
    }
  ];

  connectedCallback(): void {
    super.connectedCallback();
    theme.init({
      store: { type: 'localStorage', prefix: 'uui-' },
    });
  }

  render() {
    return html`
      <div class="header">
        <h1>Chat Component Preview</h1>
        <div class="actions">
          <u-button id="theme-toggle"
            @click=${() => theme.set(theme.get() === 'dark' ? 'light' : 'dark')}>
            테마 변경
          </u-button>
        </div>
      </div>
      <div class="main" style="overflow: auto;">
        <!-- UMessage -->
        <section>
          <h2>UMessage</h2>
          <p>AI 응답 메시지를 표시하는 컴포넌트입니다. thinking, tool, markdown 등 다양한 블록을 포함할 수 있습니다.</p>
          <div class="block-container">
            <u-message 
              .items=${this.messageItems}
              timestamp=${new Date().toISOString()}
            >
              <span slot="header">🤖 Assistant</span>
            </u-message>
          </div>
        </section>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100vw;
      min-height: 100vh;
      padding: 20px;
      box-sizing: border-box;
      color: var(--u-txt-color);
      background-color: var(--u-bg-color);
    }

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 2px solid var(--u-border-color);
    }
    .header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 600;
    }
    .header .actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }

    .main {
      display: block;
    }

    section {
      margin-bottom: 60px;
    }
    section h2 {
      margin: 0 0 10px 0;
      font-size: 1.5rem;
      font-weight: 500;
      color: var(--u-txt-color);
    }
    section h3 {
      margin: 0 0 10px 0;
      font-size: 1rem;
      font-weight: 500;
      color: var(--u-txt-color-secondary, #666);
    }
    section p {
      margin: 0 0 20px 0;
      color: var(--u-txt-color-secondary, #666);
    }

    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
      align-items: center;
    }

    .block-container {
      max-width: 800px;
    }
  `;
}