import type { DOMCommand, ExecutionResult } from './types.js';
import type { DOMScanner } from './DOMScanner.js';

/**
 * DOM 명령 실행 엔진
 * LLM의 명령을 파싱하고 실제 DOM 조작 수행
 */
export class DOMController {
  constructor(private scanner: DOMScanner) {}

  /**
   * 단일 명령 실행
   */
  async execute(command: DOMCommand): Promise<ExecutionResult> {
    try {
      // 지연 시간 적용
      if (command.options?.delay) {
        await this.wait(command.options.delay);
      }

      // 명령 실행
      await this.executeCommand(command);

      // 네비게이션 대기
      let navigationOccurred = false;
      if (command.options?.waitForNavigation) {
        navigationOccurred = await this.waitForNavigation(5000);
      }

      return {
        success: true,
        command,
        timestamp: Date.now(),
        navigationOccurred
      };
    } catch (error) {
      return {
        success: false,
        command,
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now()
      };
    }
  }

  /**
   * 여러 명령 순차 실행
   */
  async executeMany(commands: DOMCommand[]): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];

    for (const command of commands) {
      const result = await this.execute(command);
      results.push(result);

      // 실패 시 중단
      if (!result.success) {
        break;
      }

      // 자연스러운 타이밍
      await this.simulateHumanDelay();
    }

    return results;
  }

  /**
   * 명령 실행 (내부)
   */
  private async executeCommand(command: DOMCommand): Promise<void> {
    switch (command.action) {
      case 'click':
        if (!command.target) throw new Error('click: target is required');
        await this.click(command.target);
        break;

      case 'input':
        if (!command.target) throw new Error('input: target is required');
        if (command.value === undefined) throw new Error('input: value is required');
        await this.input(command.target, String(command.value));
        break;

      case 'select':
        if (!command.target) throw new Error('select: target is required');
        if (command.value === undefined) throw new Error('select: value is required');
        await this.selectOption(command.target, String(command.value));
        break;

      case 'focus':
        if (!command.target) throw new Error('focus: target is required');
        await this.focus(command.target);
        break;

      case 'blur':
        if (!command.target) throw new Error('blur: target is required');
        await this.blur(command.target);
        break;

      case 'scroll':
        if (typeof command.value !== 'object') {
          throw new Error('scroll: value should be { x, y }');
        }
        const scrollValue = command.value as any;
        await this.scroll(scrollValue.x || 0, scrollValue.y || 0);
        break;

      case 'scrollTo':
        if (!command.target) throw new Error('scrollTo: target is required');
        await this.scrollTo(command.target);
        break;

      case 'hover':
        if (!command.target) throw new Error('hover: target is required');
        await this.hover(command.target);
        break;

      case 'clear':
        if (!command.target) throw new Error('clear: target is required');
        await this.clear(command.target);
        break;

      case 'check':
        if (!command.target) throw new Error('check: target is required');
        await this.check(command.target, Boolean(command.value));
        break;

      case 'wait':
        if (command.value === undefined) throw new Error('wait: value is required');
        await this.wait(Number(command.value));
        break;

      default:
        throw new Error(`Unknown action: ${command.action}`);
    }
  }

  /**
   * 클릭 이벤트 실행
   */
  private async click(elementId: string): Promise<void> {
    const element = this.getElement(elementId);
    
    if (element instanceof HTMLElement) {
      // 스크롤하여 보이게 만들기
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await this.wait(100);

      // 클릭 이벤트 시뮬레이션
      element.click();
    } else {
      throw new Error(`Element ${elementId} is not clickable`);
    }
  }

  /**
   * 텍스트 입력 (자연스러운 타이핑 시뮬레이션)
   */
  private async input(elementId: string, text: string): Promise<void> {
    const element = this.getElement(elementId);

    if (element instanceof HTMLInputElement || 
        element instanceof HTMLTextAreaElement) {
      // 포커스
      element.focus();
      await this.wait(50);

      // 기존 값 지우기
      element.value = '';

      // 한 글자씩 입력 (자연스러운 타이밍)
      for (const char of text) {
        element.value += char;
        
        // input 이벤트 발생
        element.dispatchEvent(new Event('input', { bubbles: true }));
        
        // 타이핑 딜레이 (30-80ms)
        await this.wait(30 + Math.random() * 50);
      }

      // change 이벤트 발생
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (element instanceof HTMLElement && element.getAttribute('contenteditable') === 'true') {
      // contenteditable 요소
      element.focus();
      await this.wait(50);
      
      element.textContent = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      throw new Error(`Element ${elementId} is not an input element`);
    }
  }

  /**
   * 옵션 선택
   */
  private async selectOption(elementId: string, value: string): Promise<void> {
    const element = this.getElement(elementId);

    if (element instanceof HTMLSelectElement) {
      element.value = value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      throw new Error(`Element ${elementId} is not a select element`);
    }
  }

  /**
   * 포커스
   */
  private async focus(elementId: string): Promise<void> {
    const element = this.getElement(elementId);

    if (element instanceof HTMLElement) {
      element.focus();
    } else {
      throw new Error(`Element ${elementId} cannot be focused`);
    }
  }

  /**
   * 블러 (포커스 해제)
   */
  private async blur(elementId: string): Promise<void> {
    const element = this.getElement(elementId);

    if (element instanceof HTMLElement) {
      element.blur();
    } else {
      throw new Error(`Element ${elementId} cannot be blurred`);
    }
  }

  /**
   * 스크롤
   */
  private async scroll(x: number, y: number): Promise<void> {
    window.scrollTo({
      left: x,
      top: y,
      behavior: 'smooth'
    });
    
    // 스크롤 완료 대기
    await this.wait(300);
  }

  /**
   * 요소로 스크롤
   */
  private async scrollTo(elementId: string): Promise<void> {
    const element = this.getElement(elementId);

    if (element instanceof HTMLElement) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await this.wait(300);
    } else {
      throw new Error(`Element ${elementId} cannot be scrolled to`);
    }
  }

  /**
   * 마우스 오버 (호버)
   */
  private async hover(elementId: string): Promise<void> {
    const element = this.getElement(elementId);

    if (element instanceof HTMLElement) {
      const mouseEnterEvent = new MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      
      const mouseOverEvent = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
        view: window
      });

      element.dispatchEvent(mouseEnterEvent);
      element.dispatchEvent(mouseOverEvent);
    } else {
      throw new Error(`Element ${elementId} cannot be hovered`);
    }
  }

  /**
   * 입력 필드 초기화
   */
  private async clear(elementId: string): Promise<void> {
    const element = this.getElement(elementId);

    if (element instanceof HTMLInputElement || 
        element instanceof HTMLTextAreaElement) {
      element.value = '';
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      throw new Error(`Element ${elementId} is not an input element`);
    }
  }

  /**
   * 체크박스/라디오 토글
   */
  private async check(elementId: string, checked: boolean): Promise<void> {
    const element = this.getElement(elementId);

    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = checked;
        element.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        throw new Error(`Element ${elementId} is not a checkbox or radio`);
      }
    } else {
      throw new Error(`Element ${elementId} is not an input element`);
    }
  }

  /**
   * 대기
   */
  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 페이지 네비게이션 대기
   */
  private async waitForNavigation(timeout: number = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      const currentUrl = window.location.href;
      const startTime = Date.now();

      const checkNavigation = () => {
        if (window.location.href !== currentUrl) {
          resolve(true);
        } else if (Date.now() - startTime > timeout) {
          resolve(false);
        } else {
          setTimeout(checkNavigation, 100);
        }
      };

      checkNavigation();
    });
  }

  /**
   * 사람처럼 보이는 랜덤 딜레이
   */
  private async simulateHumanDelay(): Promise<void> {
    // 100-300ms 랜덤 딜레이
    const delay = 100 + Math.random() * 200;
    await this.wait(delay);
  }

  /**
   * ID로 요소 가져오기 (Scanner의 매핑 활용)
   */
  private getElement(id: string): Element {
    const element = this.scanner.getElement(id);
    if (!element) {
      throw new Error(`Element with id ${id} not found`);
    }
    return element;
  }
}
