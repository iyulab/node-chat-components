import { DOMScanner } from './DOMScanner.js';
import { DOMController } from './DOMController.js';
import type {
  ScanResult,
  ScanOptions,
  DOMCommand,
  ExecutionResult,
  HistoryItem,
  AutomationOptions,
  LLMCallback,
  ScanDiff,
  ScannedElement
} from './types.js';

/**
 * DOM Agent 통합 오케스트레이터
 * Scanner와 Controller를 조합하여 전체 워크플로우 관리
 */
export class DOMAgent extends EventTarget {
  private scanner: DOMScanner;
  private controller: DOMController;
  private history: HistoryItem[] = [];
  private currentScan: ScanResult | null = null;
  private lastScanRoot: Element | ShadowRoot = document.body;  // 마지막 스캔 루트 기억

  constructor() {
    super();
    this.scanner = new DOMScanner();
    this.controller = new DOMController(this.scanner);
  }

  /**
   * 초기 스캔 및 세션 시작
   */
  async start(root?: Element | ShadowRoot, options?: ScanOptions & { includeScreenshot?: boolean }): Promise<ScanResult> {
    try {
      const scanRoot = root || document.body;
      this.lastScanRoot = scanRoot;  // 루트 저장
      
      const scan = this.scanner.scan(scanRoot, options);
      
      // 스크린샷 캡처 (옵션이 활성화된 경우)
      if (options?.includeScreenshot) {
        scan.screenshot = await this.captureScreenshot(scanRoot);
      }
      
      this.currentScan = scan;

      // 스캔 이벤트 발생
      this.dispatchEvent(new CustomEvent('scan', { detail: scan }));

      return scan;
    } catch (error) {
      this.dispatchError(error);
      throw error;
    }
  }

  /**
   * 명령 실행 후 재스캔
   */
  async executeAndRescan(
    commands: DOMCommand | DOMCommand[],
    options?: ScanOptions & { includeScreenshot?: boolean }
  ): Promise<{
    execution: ExecutionResult[];
    scan: ScanResult;
  }> {
    try {
      const commandArray = Array.isArray(commands) ? commands : [commands];

      // 명령 이벤트 발생
      for (const command of commandArray) {
        this.dispatchEvent(new CustomEvent('command', { detail: command }));
      }

      // 명령 실행
      const execution = await this.controller.executeMany(commandArray);

      // 실행 이벤트 발생
      for (const result of execution) {
        this.dispatchEvent(new CustomEvent('execute', { detail: result }));
      }

      // 재스캔 (마지막 스캔 루트 사용)
      const scan = this.scanner.scan(this.lastScanRoot, options);
      
      // 스크린샷 캡처 (옵션이 활성화된 경우)
      if (options?.includeScreenshot) {
        scan.screenshot = await this.captureScreenshot(this.lastScanRoot);
      }
      
      this.currentScan = scan;

      // 스캔 이벤트 발생
      this.dispatchEvent(new CustomEvent('scan', { detail: scan }));

      // 히스토리 저장
      this.history.push({
        scan,
        commands: commandArray,
        results: execution
      });

      return { execution, scan };
    } catch (error) {
      this.dispatchError(error);
      throw error;
    }
  }

  /**
   * 현재 상태 가져오기
   */
  getCurrentState(): ScanResult | null {
    return this.currentScan;
  }

  /**
   * 히스토리 조회
   */
  getHistory(): HistoryItem[] {
    return [...this.history];
  }

  /**
   * 히스토리 초기화
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * 자동 모드: LLM 콜백과 함께 반복 실행
   */
  async automate(
    llmCallback: LLMCallback,
    options?: AutomationOptions
  ): Promise<void> {
    const {
      maxIterations = 10,
      stopCondition,
      includeScreenshot = false
    } = options || {};

    try {
      // 초기 스캔
      let scan = await this.start(undefined, { includeScreenshot });

      for (let iteration = 0; iteration < maxIterations; iteration++) {
        // 반복 이벤트 발생
        this.dispatchEvent(new CustomEvent('iteration', { detail: iteration }));

        // 중지 조건 체크
        if (stopCondition && stopCondition(scan)) {
          break;
        }

        // LLM에게 명령 요청
        const commands = await llmCallback(scan);

        // 명령이 없으면 종료
        if (!commands || commands.length === 0) {
          break;
        }

        // 명령 실행 및 재스캔
        const result = await this.executeAndRescan(commands, { includeScreenshot });
        scan = result.scan;

        // 실행 실패 시 종료
        const hasFailure = result.execution.some(r => !r.success);
        if (hasFailure) {
          break;
        }
      }
    } catch (error) {
      this.dispatchError(error);
      throw error;
    }
  }

  /**
   * 특정 요소 스캔
   */
  async scanElement(elementId: string, options?: ScanOptions): Promise<ScanResult> {
    try {
      const element = this.scanner.getElement(elementId);
      if (!element) {
        throw new Error(`Element with id ${elementId} not found`);
      }

      const scan = this.scanner.scan(element as Element, options);
      this.dispatchEvent(new CustomEvent('scan', { detail: scan }));

      return scan;
    } catch (error) {
      this.dispatchError(error);
      throw error;
    }
  }

  /**
   * 에러 이벤트 발생
   */
  private dispatchError(error: unknown): void {
    const errorEvent = new CustomEvent('error', {
      detail: error instanceof Error ? error : new Error(String(error))
    });
    this.dispatchEvent(errorEvent);
  }

  /**
   * 스크린샷 캡처 (html2canvas 사용)
   */
  private async captureScreenshot(element: Element | ShadowRoot): Promise<string | undefined> {
    try {
      // html2canvas 동적 import
      const html2canvas = await import('html2canvas').then(m => m.default);
      
      // ShadowRoot인 경우 host 요소 사용
      const targetElement = element instanceof ShadowRoot ? element.host : element;
      
      // 캔버스 생성
      const canvas = await html2canvas(targetElement as HTMLElement, {
        allowTaint: true,
        useCORS: true,
        scale: 1,  // 1:1 스케일 (성능 고려)
        logging: false
      });
      
      // Base64로 변환 (data:image/png;base64, 제외)
      const base64 = canvas.toDataURL('image/png').split(',')[1];
      
      return base64;
    } catch (error) {
      console.warn('[DOMAgent] Screenshot capture failed:', error);
      return undefined;
    }
  }

  /**
   * Scanner 인스턴스 가져오기 (고급 사용)
   */
  getScanner(): DOMScanner {
    return this.scanner;
  }

  /**
   * Controller 인스턴스 가져오기 (고급 사용)
   */
  getController(): DOMController {
    return this.controller;
  }

  /**
   * 이전 스캔과 현재 스캔 비교 (Diff)
   */
  scanDiff(previousScan: ScanResult, currentScan: ScanResult): ScanDiff {
    const prevElementsMap = new Map<string, ScannedElement>();
    const currElementsMap = new Map<string, ScannedElement>();

    // 평탄화하여 맵 생성
    const flatten = (elements: ScannedElement[], map: Map<string, ScannedElement>) => {
      for (const elem of elements) {
        map.set(elem.id, elem);
        if (elem.children) {
          flatten(elem.children, map);
        }
      }
    };

    flatten(previousScan.elements, prevElementsMap);
    flatten(currentScan.elements, currElementsMap);

    const added: ScannedElement[] = [];
    const removed: ScannedElement[] = [];
    const modified: ScannedElement[] = [];
    const unchanged: ScannedElement[] = [];

    // 추가 및 변경 확인
    for (const [id, currElem] of currElementsMap) {
      const prevElem = prevElementsMap.get(id);
      if (!prevElem) {
        added.push(currElem);
      } else if (this.isElementModified(prevElem, currElem)) {
        modified.push(currElem);
      } else {
        unchanged.push(currElem);
      }
    }

    // 제거 확인
    for (const [id, prevElem] of prevElementsMap) {
      if (!currElementsMap.has(id)) {
        removed.push(prevElem);
      }
    }

    return { added, removed, modified, unchanged };
  }

  /**
   * 요소 변경 여부 확인
   */
  private isElementModified(prev: ScannedElement, curr: ScannedElement): boolean {
    return (
      prev.text !== curr.text ||
      prev.value !== curr.value ||
      prev.disabled !== curr.disabled ||
      prev.visible !== curr.visible ||
      prev.focused !== curr.focused ||
      prev.checked !== curr.checked
    );
  }
}

