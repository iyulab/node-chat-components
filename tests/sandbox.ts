import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

/**
 * DOM Agent 테스트를 위한 샌드박스 컴포넌트
 * 다양한 인터랙티브 요소들을 포함하여 DOM 스캔 및 조작을 테스트할 수 있습니다.
 */
@customElement('sandbox-app')
export class SandboxApp extends LitElement {
  @state() counter = 0;
  @state() inputValue = '';
  @state() selectedOption = 'option1';
  @state() isChecked = false;
  @state() selectedRadio = 'radio1';
  @state() statusMessage = '대기 중...';
  @state() todos: string[] = [];
  @state() newTodo = '';

  render() {
    return html`
      <div class="container">
        <h2>DOM Agent 테스트 샌드박스</h2>
        <p class="description">
          LLM이 이 페이지의 DOM을 스캔하고 인터랙션할 수 있는지 테스트합니다.
        </p>

        <!-- Section 1: 버튼들 -->
        <section class="section">
          <h3>버튼 테스트</h3>
          <div class="button-group">
            <button
              data-llm-description="카운터를 1 증가시키는 버튼"
              aria-label="카운터 증가"
              @click=${() => this.counter++}
            >
              카운터 증가 (${this.counter})
            </button>

            <button
              data-llm-description="카운터를 0으로 리셋하는 버튼"
              aria-label="카운터 리셋"
              @click=${() => this.counter = 0}
            >
              카운터 리셋
            </button>

            <button
              data-llm-description="상태 메시지를 변경하는 버튼"
              aria-label="상태 변경"
              @click=${() => this.statusMessage = `클릭됨! (${new Date().toLocaleTimeString()})`}
            >
              상태 변경
            </button>
          </div>
          <div class="status">상태: ${this.statusMessage}</div>
        </section>

        <!-- Section 2: 입력 필드들 -->
        <section class="section">
          <h3>입력 필드 테스트</h3>
          <div class="form-group">
            <label>
              <span>텍스트 입력</span>
              <input
                type="text"
                data-llm-description="사용자 이름을 입력하는 텍스트 필드"
                placeholder="이름을 입력하세요"
                aria-label="이름 입력"
                .value=${this.inputValue}
                @input=${(e: Event) => this.inputValue = (e.target as HTMLInputElement).value}
              />
            </label>
            <div class="output">입력값: ${this.inputValue || '(없음)'}</div>

            <label>
              <span>체크박스</span>
              <input
                type="checkbox"
                data-llm-description="동의 여부를 체크하는 체크박스"
                aria-label="동의 체크박스"
                .checked=${this.isChecked}
                @change=${(e: Event) => this.isChecked = (e.target as HTMLInputElement).checked}
              />
              <span>${this.isChecked ? '체크됨' : '체크 안됨'}</span>
            </label>

            <label>
              <span>셀렉트</span>
              <select
                data-llm-description="옵션을 선택하는 드롭다운"
                aria-label="옵션 선택"
                .value=${this.selectedOption}
                @change=${(e: Event) => this.selectedOption = (e.target as HTMLSelectElement).value}
              >
                <option value="option1">옵션 1</option>
                <option value="option2">옵션 2</option>
                <option value="option3">옵션 3</option>
              </select>
            </label>
            <div class="output">선택값: ${this.selectedOption}</div>
          </div>
        </section>

        <!-- Section 3: 라디오 버튼 -->
        <section class="section">
          <h3>라디오 버튼 테스트</h3>
          <div class="radio-group">
            <label>
              <input
                type="radio"
                name="radio-group"
                value="radio1"
                data-llm-description="첫 번째 라디오 버튼"
                .checked=${this.selectedRadio === 'radio1'}
                @change=${(e: Event) => this.selectedRadio = (e.target as HTMLInputElement).value}
              />
              <span>라디오 1</span>
            </label>
            <label>
              <input
                type="radio"
                name="radio-group"
                value="radio2"
                data-llm-description="두 번째 라디오 버튼"
                .checked=${this.selectedRadio === 'radio2'}
                @change=${(e: Event) => this.selectedRadio = (e.target as HTMLInputElement).value}
              />
              <span>라디오 2</span>
            </label>
            <label>
              <input
                type="radio"
                name="radio-group"
                value="radio3"
                data-llm-description="세 번째 라디오 버튼"
                .checked=${this.selectedRadio === 'radio3'}
                @change=${(e: Event) => this.selectedRadio = (e.target as HTMLInputElement).value}
              />
              <span>라디오 3</span>
            </label>
          </div>
          <div class="output">선택값: ${this.selectedRadio}</div>
        </section>

        <!-- Section 4: 동적 리스트 (Todo) -->
        <section class="section">
          <h3>동적 리스트 테스트</h3>
          <div class="todo-container">
            <div class="todo-input-group">
              <input
                type="text"
                data-llm-description="새 할일을 입력하는 텍스트 필드"
                placeholder="할일을 입력하세요"
                aria-label="새 할일 입력"
                .value=${this.newTodo}
                @input=${(e: Event) => this.newTodo = (e.target as HTMLInputElement).value}
                @keypress=${(e: KeyboardEvent) => e.key === 'Enter' && this.addTodo()}
              />
              <button
                data-llm-description="새 할일을 추가하는 버튼"
                aria-label="할일 추가"
                @click=${this.addTodo}
              >
                추가
              </button>
            </div>
            <ul class="todo-list">
              ${this.todos.map((todo, index) => html`
                <li>
                  <span>${todo}</span>
                  <button
                    data-llm-description="할일 ${index + 1}을 삭제하는 버튼"
                    aria-label="할일 삭제"
                    @click=${() => this.removeTodo(index)}
                  >
                    삭제
                  </button>
                </li>
              `)}
            </ul>
            ${this.todos.length === 0 ? html`<p class="empty">할일이 없습니다.</p>` : ''}
          </div>
        </section>

        <!-- Section 5: 링크 -->
        <section class="section">
          <h3>링크 테스트</h3>
          <div class="link-group">
            <a
              href="#section1"
              data-llm-description="첫 번째 섹션으로 이동하는 링크"
              aria-label="섹션 1로 이동"
              @click=${(e: Event) => { e.preventDefault(); this.statusMessage = '섹션 1 링크 클릭'; }}
            >
              섹션 1로 이동
            </a>
            <a
              href="https://github.com"
              target="_blank"
              data-llm-description="GitHub 웹사이트로 이동하는 외부 링크"
              aria-label="GitHub 열기"
            >
              GitHub 열기 (외부)
            </a>
          </div>
        </section>

        <!-- Section 6: Shadow DOM 컴포넌트 -->
        <section class="section">
          <h3>Shadow DOM 컴포넌트</h3>
          <sandbox-shadow-component></sandbox-shadow-component>
        </section>

        <!-- Section 7: 결과 영역 -->
        <section class="section results">
          <h3>현재 상태 요약</h3>
          <ul>
            <li>카운터: ${this.counter}</li>
            <li>입력값: ${this.inputValue || '(없음)'}</li>
            <li>체크박스: ${this.isChecked ? '체크됨' : '체크 안됨'}</li>
            <li>셀렉트: ${this.selectedOption}</li>
            <li>라디오: ${this.selectedRadio}</li>
            <li>할일 개수: ${this.todos.length}</li>
            <li>상태 메시지: ${this.statusMessage}</li>
          </ul>
        </section>
      </div>
    `;
  }

  private addTodo() {
    if (this.newTodo.trim()) {
      this.todos = [...this.todos, this.newTodo.trim()];
      this.newTodo = '';
    }
  }

  private removeTodo(index: number) {
    this.todos = this.todos.filter((_, i) => i !== index);
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
      background: var(--u-background-color, #ffffff);
      color: var(--u-text-color, #333333);
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    h2 {
      margin-top: 0;
      color: var(--u-text-color);
    }

    .description {
      color: var(--u-text-secondary-color, #666);
      margin-bottom: 24px;
    }

    .section {
      margin-bottom: 32px;
      padding: 16px;
      border: 1px solid var(--u-border-color, #e0e0e0);
      border-radius: 8px;
      background: var(--u-surface-color, #fafafa);
    }

    .section h3 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 1.1rem;
      color: var(--u-text-color);
    }

    .button-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }

    button {
      padding: 8px 16px;
      background: var(--u-primary-color, #007bff);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    button:hover {
      background: var(--u-primary-hover-color, #0056b3);
    }

    .status, .output {
      margin-top: 8px;
      padding: 8px;
      background: var(--u-background-color, #fff);
      border-radius: 4px;
      font-size: 14px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    label > span {
      font-weight: 500;
      font-size: 14px;
    }

    input[type="text"],
    select {
      padding: 8px;
      border: 1px solid var(--u-border-color, #ccc);
      border-radius: 4px;
      font-size: 14px;
    }

    input[type="checkbox"],
    input[type="radio"] {
      width: 18px;
      height: 18px;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .radio-group label {
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }

    .todo-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .todo-input-group {
      display: flex;
      gap: 8px;
    }

    .todo-input-group input {
      flex: 1;
    }

    .todo-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .todo-list li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      background: var(--u-background-color, #fff);
      border-radius: 4px;
      border: 1px solid var(--u-border-color, #e0e0e0);
    }

    .empty {
      text-align: center;
      color: var(--u-text-secondary-color, #999);
      padding: 16px;
    }

    .link-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    a {
      color: var(--u-primary-color, #007bff);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .results {
      background: var(--u-success-background-color, #e8f5e9);
    }

    .results ul {
      margin: 0;
      padding-left: 20px;
    }

    .results li {
      margin-bottom: 4px;
    }
  `;
}

/**
 * Shadow DOM 테스트를 위한 서브 컴포넌트
 */
@customElement('sandbox-shadow-component')
export class SandboxShadowComponent extends LitElement {
  @state() shadowCounter = 0;

  render() {
    return html`
      <div class="shadow-container">
        <p>이것은 Shadow DOM 내부의 컴포넌트입니다.</p>
        <button
          data-llm-description="Shadow DOM 내부의 카운터 버튼"
          aria-label="Shadow 카운터"
          @click=${() => this.shadowCounter++}
        >
          Shadow 카운터 (${this.shadowCounter})
        </button>
      </div>
    `;
  }

  static styles = css`
    .shadow-container {
      padding: 16px;
      background: var(--u-info-background-color, #e3f2fd);
      border-radius: 4px;
      border: 2px dashed var(--u-info-color, #2196F3);
    }

    p {
      margin: 0 0 8px 0;
      font-size: 14px;
    }

    button {
      padding: 8px 16px;
      background: var(--u-info-color, #2196F3);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background: var(--u-info-hover-color, #1976D2);
    }
  `;
}
