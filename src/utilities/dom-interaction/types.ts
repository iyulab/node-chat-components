/**
 * DOM Interaction Types
 * LLM이 웹 페이지를 스캔하고 인터랙션할 수 있게 하는 타입 정의
 */

/**
 * 스캔된 요소의 타입
 */
export type ElementType = 
  | 'button'
  | 'input'
  | 'link'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'custom'
  | 'other';

/**
 * 스캔된 DOM 요소
 */
export interface ScannedElement {
  /** 랜덤 생성된 고유 식별자 (예: elm_a1b2c3) */
  id: string;
  /** 요소 타입 */
  type: ElementType;
  /** HTML 태그명 */
  tag: string;
  /** 텍스트 콘텐츠 */
  text?: string;
  /** input 값 */
  value?: string;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** aria-label 또는 연결된 label */
  label?: string;
  /** data-llm-description 값 (LLM을 위한 설명) */
  description?: string;
  /** ARIA role */
  role?: string;
  /** disabled 상태 */
  disabled: boolean;
  /** 시각적으로 보이는지 여부 */
  visible: boolean;
  /** 포커스 상태 */
  focused: boolean;
  /** 체크 상태 (checkbox/radio) */
  checked?: boolean;
  /** Shadow DOM 내부 요소 여부 */
  inShadowDom: boolean;
  /** 화면 상 x 위치 */
  x: number;
  /** 화면 상 y 위치 */
  y: number;
  /** 너비 */
  width: number;
  /** 높이 */
  height: number;
  /** 우선순위 점수 (필터링용) */
  priority: number;
  /** 자식 요소들 (필터링된) */
  children?: ScannedElement[];
}

/**
 * DOM 스캔 결과
 */
export interface ScanResult {
  /** 스캔 타임스탬프 */
  timestamp: number;
  /** 현재 URL */
  url: string;
  /** 페이지 제목 */
  title: string;
  /** 스캔된 요소들 */
  elements: ScannedElement[];
  /** Base64 인코딩된 스크린샷 (optional) */
  screenshot?: string;
  /** 스크롤 위치 */
  scrollPosition: { x: number; y: number };
  /** 뷰포트 크기 */
  viewport: { width: number; height: number };
  /** 전체 DOM 요소 수 */
  totalElements: number;
  /** LLM에게 제공되는 필터링된 요소 수 */
  filteredElements: number;
}

/**
 * 필터링 전략
 */
export type FilterStrategy = 
  | 'all'          // 모든 인터랙티브 요소 (테스트용)
  | 'interactive'  // 주요 인터랙티브 요소만
  | 'described'    // data-llm-description 있는 요소 우선
  | 'visible';     // 화면에 보이는 요소만

/**
 * 스캔 옵션
 */
export interface ScanOptions {
  /** 스크린샷 포함 여부 */
  includeScreenshot?: boolean;
  /** 최대 요소 수 제한 */
  maxElements?: number;
  /** 최대 깊이 제한 */
  maxDepth?: number;
  /** 필터링 전략 */
  filterStrategy?: FilterStrategy;
  /** 디버그 로그 활성화 (기본값: false) */
  debug?: boolean;
  /** 캐싱 사용 여부 (기본값: true) */
  useCache?: boolean;
  /** iframe 포함 여부 (기본값: false) */
  includeIframes?: boolean;
  /** ARIA Landmark 우선순위 증가 (기본값: true) */
  prioritizeLandmarks?: boolean;
}

/**
 * DOM 명령 액션
 */
export type DOMAction = 
  | 'click'
  | 'input'
  | 'select'
  | 'focus'
  | 'blur'
  | 'scroll'
  | 'scrollTo'
  | 'hover'
  | 'clear'
  | 'check'
  | 'wait';

/**
 * DOM 명령
 */
export interface DOMCommand {
  /** 실행할 액션 */
  action: DOMAction;
  /** 대상 요소 ID (DOMScanner가 생성한 랜덤 ID) */
  target?: string;
  /** 명령 값 (input 텍스트, select 옵션 등) */
  value?: string | number | boolean;
  /** 추가 옵션 */
  options?: {
    /** 명령 실행 전 대기 시간 (ms) */
    delay?: number;
    /** 네비게이션 대기 여부 */
    waitForNavigation?: boolean;
  };
}

/**
 * 명령 실행 결과
 */
export interface ExecutionResult {
  /** 성공 여부 */
  success: boolean;
  /** 실행된 명령 */
  command: DOMCommand;
  /** 에러 메시지 (실패 시) */
  error?: string;
  /** 실행 타임스탬프 */
  timestamp: number;
  /** 페이지 네비게이션 발생 여부 */
  navigationOccurred?: boolean;
}

/**
 * DOMAgent 이벤트 타입
 */
export interface DOMAgentEvents {
  /** 스캔 완료 */
  scan: ScanResult;
  /** 명령 수신 */
  command: DOMCommand;
  /** 명령 실행 완료 */
  execute: ExecutionResult;
  /** 에러 발생 */
  error: Error;
  /** 반복 횟수 */
  iteration: number;
}

/**
 * 자동화 옵션
 */
export interface AutomationOptions {
  /** 최대 반복 횟수 */
  maxIterations?: number;
  /** 중지 조건 함수 */
  stopCondition?: (scan: ScanResult) => boolean;
  /** 스크린샷 포함 여부 */
  includeScreenshot?: boolean;
}

/**
 * 히스토리 항목
 */
export interface HistoryItem {
  /** 스캔 결과 */
  scan: ScanResult;
  /** 실행된 명령들 */
  commands: DOMCommand[];
  /** 실행 결과들 */
  results: ExecutionResult[];
}

/**
 * LLM 콜백 함수 타입
 */
export type LLMCallback = (scan: ScanResult) => Promise<DOMCommand[]>;

/**
 * 캐시 항목
 */
export interface CachedScan {
  /** 캐시된 스캔 결과 */
  result: ScanResult;
  /** 캐시 생성 시간 */
  timestamp: number;
  /** DOM 해시 (변경 감지용) */
  domHash: string;
}

/**
 * Diff 결과
 */
export interface ScanDiff {
  /** 추가된 요소 */
  added: ScannedElement[];
  /** 제거된 요소 */
  removed: ScannedElement[];
  /** 변경된 요소 */
  modified: ScannedElement[];
  /** 변경되지 않은 요소 */
  unchanged: ScannedElement[];
}
