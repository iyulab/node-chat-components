import type { 
  ScannedElement, 
  ScanResult, 
  ScanOptions, 
  FilterStrategy,
  ElementType,
  CachedScan
} from './types.js';

/**
 * DOM 스캔 엔진
 * Shadow DOM을 포함한 전체 DOM 트리를 순회하며 인터랙티브 요소를 추출
 */
export class DOMScanner {
  private elementMap = new WeakMap<Element, string>();  // Element → ID 매핑
  private idMap = new Map<string, Element>();           // ID → Element 매핑
  private totalElementsScanned = 0;
  private debug = false;  // 디버그 모드 플래그
  private cachedScan: CachedScan | null = null;  // 캐시된 스캔 결과
  private prioritizeLandmarks = true;  // ARIA Landmark 우선순위

  /**
   * DOM 스캔 수행 (Shadow DOM 포함)
   * @param root 스캔 시작 루트 (기본값 document.body)
   * @param options 스캔 옵션
   */
  scan(root: Element | ShadowRoot = document.body, options: ScanOptions = {}): ScanResult {
    const {
      includeScreenshot = false,
      maxElements = 100,
      maxDepth = 50,
      filterStrategy = 'interactive',
      debug = false,
      useCache = true,
      includeIframes = false,
      prioritizeLandmarks = true
    } = options;

    this.debug = debug;
    this.prioritizeLandmarks = prioritizeLandmarks;

    // 캐시 체크
    if (useCache && this.cachedScan) {
      const currentHash = this.generateDOMHash(root);
      if (this.cachedScan.domHash === currentHash && Date.now() - this.cachedScan.timestamp < 5000) {
        this.log('[SCANNER DEBUG] Using cached scan result');
        return this.cachedScan.result;
      }
    }

    this.log('[SCANNER DEBUG] 1. scan() 시작');
    this.log('[SCANNER DEBUG] 2. root:', root);
    this.log('[SCANNER DEBUG] 3. options:', options);
    this.log('[SCANNER DEBUG] 4. filterStrategy:', filterStrategy);

    // 재초기화
    this.idMap.clear();
    this.totalElementsScanned = 0;

    // 요소 스캔
    let allElements: ScannedElement[] = [];

    if (root instanceof ShadowRoot) {
      // ShadowRoot의 경우 모든 자식 요소 스캔
      this.log('[SCANNER DEBUG] 5. ShadowRoot 감지');
      const children = Array.from(root.children);
      this.log('[SCANNER DEBUG] 6. children ??', children.length);
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        this.log(`[SCANNER DEBUG] 7. child[${i}] 스캔 중`, child.tagName);
        const scanned = this.scanElement(child, false, 0, maxDepth, filterStrategy, includeIframes);
        this.log(`[SCANNER DEBUG] 8. child[${i}] 스캔 결과:`, scanned ? 'OK' : 'NULL');
        if (scanned) allElements.push(scanned);
      }
    } else {
      // Element의 경우 해당 요소 스캔
      this.log('[SCANNER DEBUG] 9. Element 감지');
      const scanned = this.scanElement(root, false, 0, maxDepth, filterStrategy, includeIframes);
      this.log('[SCANNER DEBUG] 10. Element 스캔 결과:', scanned ? 'OK' : 'NULL');
      if (scanned) allElements.push(scanned);
    }
    
    this.log('[SCANNER DEBUG] 11. allElements ??', allElements.length);
    const flatElements = this.flattenElements(allElements);
    this.log('[SCANNER DEBUG] 12. flatElements ??', flatElements.length);

    // 우선순위 기반 필터링
    const filteredElements = this.filterByPriority(flatElements, maxElements);

    // 스캔 결과 생성
    const result: ScanResult = {
      timestamp: Date.now(),
      url: window.location.href,
      title: document.title,
      elements: filteredElements,
      scrollPosition: {
        x: window.scrollX,
        y: window.scrollY
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      totalElements: this.totalElementsScanned,
      filteredElements: filteredElements.length
    };

    // 스크린샷 캡처 (옵션)
    if (includeScreenshot) {
      // TODO: Phase 2에서 구현
      // result.screenshot = await this.captureScreenshot();
    }

    // 캐시 저장
    if (useCache) {
      this.cachedScan = {
        result,
        timestamp: Date.now(),
        domHash: this.generateDOMHash(root)
      };
    }

    return result;
  }

  /**
   * ID로 요소 객체 가져오기 (빠른 조회)
   */
  getElement(id: string): Element | undefined {
    return this.idMap.get(id);
  }

  /**
   * 요소에서 ID 가져오기
   */
  getElementId(element: Element): string | undefined {
    return this.elementMap.get(element);
  }

  /**
   * 단일 요소를 스캔하고 Shadow DOM도 탐색
   */
  private scanElement(
    element: Element,
    inShadowDom: boolean,
    depth: number,
    maxDepth: number,
    filterStrategy: FilterStrategy,
    includeIframes: boolean = false
  ): ScannedElement | null {
    this.totalElementsScanned++;

    this.log(`[SCANNER DEBUG] scanElement() - tag: ${element.tagName}, depth: ${depth}, filterStrategy: ${filterStrategy}`);

    // 깊이 제한
    if (depth > maxDepth) {
      this.log(`[SCANNER DEBUG] - SKIP: depth ${depth} > maxDepth ${maxDepth}`);
      return null;
    }

    // 필터링 체크
    const shouldInclude = this.shouldInclude(element, filterStrategy);
    this.log(`[SCANNER DEBUG] - shouldInclude: ${shouldInclude}`);
    
    // 컨테이너 요소인지 확인 (div, section 등은 자식을 계속 탐색해야 함)
    const containerTags = ['div', 'section', 'article', 'main', 'nav', 'header', 'footer', 'aside', 'form', 'fieldset', 'ul', 'ol', 'li', 'dl', 'table', 'tbody', 'thead', 'tr', 'label'];
    const isContainer = containerTags.includes(element.tagName.toLowerCase());
    this.log(`[SCANNER DEBUG] - isContainer: ${isContainer}`);
    
    if (!shouldInclude && !isContainer) {
      this.log(`[SCANNER DEBUG] - SKIP: shouldInclude=false and not container`);
      return null;
    }

    this.log(`[SCANNER DEBUG] - PASS: 요소 스캔 진행 (include=${shouldInclude}, container=${isContainer})`);

    // ID 생성 및 매핑 (shouldInclude=true인 경우만)
    const id = this.generateId();
    if (shouldInclude) {
      this.elementMap.set(element, id);
      this.idMap.set(id, element);
    }

    // 요소 정보 추출
    const info = this.getElementInfo(element);
    const rect = element.getBoundingClientRect();

    // 우선순위 계산 (컨테이너는 -1로 설정하여 나중에 필터링)
    const priority = shouldInclude ? this.calculatePriority(element) : -1;
    this.log(`[SCANNER DEBUG] - priority: ${priority}`);

    const scannedElement: ScannedElement = {
      id,
      type: this.getElementType(element),
      tag: element.tagName.toLowerCase(),
      text: info.text,
      value: info.value,
      placeholder: info.placeholder,
      label: info.label,
      description: info.description,
      role: info.role,
      disabled: info.disabled || false,
      visible: this.isVisible(element),
      focused: document.activeElement === element,
      checked: info.checked,
      inShadowDom,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      priority,
      children: []
    };

    // Shadow DOM 스캔
    if (element.shadowRoot) {
      const shadowChildren = this.scanShadowRoot(
        element.shadowRoot,
        depth + 1,
        maxDepth,
        filterStrategy,
        includeIframes
      );
      scannedElement.children?.push(...shadowChildren);
    }

    // iframe 처리
    if (includeIframes && element.tagName.toLowerCase() === 'iframe') {
      try {
        const iframe = element as HTMLIFrameElement;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc && iframeDoc.body) {
          this.log('[SCANNER DEBUG] - Scanning iframe content');
          const iframeScanned = this.scanElement(
            iframeDoc.body,
            inShadowDom,
            depth + 1,
            maxDepth,
            filterStrategy,
            includeIframes
          );
          if (iframeScanned) {
            scannedElement.children?.push(iframeScanned);
          }
        }
      } catch (e) {
        // Cross-origin iframe - 접근 불가
        this.log('[SCANNER DEBUG] - iframe 접근 불가 (cross-origin)');
      }
    }

    // 일반 자식 요소 스캔
    for (const child of Array.from(element.children)) {
      const scannedChild = this.scanElement(
        child,
        inShadowDom,
        depth + 1,
        maxDepth,
        filterStrategy,
        includeIframes
      );
      if (scannedChild) {
        scannedElement.children?.push(scannedChild);
      }
    }

    return scannedElement;
  }

  /**
   * Shadow DOM 내부 스캔
   */
  private scanShadowRoot(
    shadowRoot: ShadowRoot,
    depth: number,
    maxDepth: number,
    filterStrategy: FilterStrategy,
    includeIframes: boolean = false
  ): ScannedElement[] {
    const elements: ScannedElement[] = [];

    for (const child of Array.from(shadowRoot.children)) {
      const scannedElement = this.scanElement(
        child,
        true,
        depth,
        maxDepth,
        filterStrategy,
        includeIframes
      );
      if (scannedElement) {
        elements.push(scannedElement);
      }
    }

    return elements;
  }

  /**
   * 인터랙티브 요소 여부 판단
   */
  private isInteractive(element: Element): boolean {
    const tag = element.tagName.toLowerCase();
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    
    if (interactiveTags.includes(tag)) {
      return true;
    }

    // role 체크
    const role = element.getAttribute('role');
    if (role && ['button', 'link', 'textbox', 'checkbox', 'radio'].includes(role)) {
      return true;
    }

    // 이벤트 핸들러 체크
    if (element.hasAttribute('onclick') || element.hasAttribute('ng-click')) {
      return true;
    }

    // contenteditable
    if (element.getAttribute('contenteditable') === 'true') {
      return true;
    }

    return false;
  }

  /**
   * 필터링 기준 충족 여부 (LLM에게 보여줄 가치가 있는지)
   */
  private shouldInclude(element: Element, strategy: FilterStrategy): boolean {
    this.log(`[SCANNER DEBUG] shouldInclude() - tag: ${element.tagName}, strategy: ${strategy}`);
    
    // 모든 전략에서 숨겨진 요소는 제외
    const visible = this.isVisible(element);
    this.log(`[SCANNER DEBUG] - isVisible: ${visible}`);
    
    if (!visible && strategy !== 'all') {
      this.log(`[SCANNER DEBUG] - REJECT: not visible and strategy != all`);
      return false;
    }

    const interactive = this.isInteractive(element);
    this.log(`[SCANNER DEBUG] - isInteractive: ${interactive}`);

    switch (strategy) {
      case 'all':
        this.log(`[SCANNER DEBUG] - strategy=all, return: ${interactive}`);
        return interactive;

      case 'interactive':
        this.log(`[SCANNER DEBUG] - strategy=interactive, return: ${interactive}`);
        return interactive;

      case 'described':
        // data-llm-description이 있거나 인터랙티브 요소
        const hasDescription = element.hasAttribute('data-llm-description');
        this.log(`[SCANNER DEBUG] - hasAttribute(data-llm-description): ${hasDescription}`);
        const result = hasDescription || interactive;
        this.log(`[SCANNER DEBUG] - strategy=described, return: ${result}`);
        return result;

      case 'visible':
        const visResult = interactive && visible;
        this.log(`[SCANNER DEBUG] - strategy=visible, return: ${visResult}`);
        return visResult;

      default:
        this.log(`[SCANNER DEBUG] - strategy=default, return: ${interactive}`);
        return interactive;
    }
  }

  /**
   * 짧은 랜덤 ID 생성 (예: elm_a1b2c3)
   */
  private generateId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'elm_';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 요소 정보 추출
   */
  private getElementInfo(element: Element): Partial<ScannedElement> {
    const info: Partial<ScannedElement> = {};

    // 텍스트 콘텐츠 (트리밍)
    const textContent = element.textContent?.trim() || '';
    if (textContent.length > 0) {
      info.text = textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
    }

    // input �?
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      info.value = element.value;
      info.placeholder = element.placeholder;
      
      if (element instanceof HTMLInputElement) {
        if (element.type === 'checkbox' || element.type === 'radio') {
          info.checked = element.checked;
        }
      }
    }

    if (element instanceof HTMLSelectElement) {
      info.value = element.value;
    }

    // 레이블
    info.label = this.getLabel(element);

    // data-llm-description
    const description = element.getAttribute('data-llm-description');
    if (description) {
      info.description = description;
    }

    // ARIA role
    const role = element.getAttribute('role');
    if (role) {
      info.role = role;
    }

    // disabled
    if (element instanceof HTMLButtonElement || 
        element instanceof HTMLInputElement || 
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement) {
      info.disabled = element.disabled;
    }

    return info;
  }

  /**
   * 요소의 레이블 가져오기
   */
  private getLabel(element: Element): string | undefined {
    // aria-label 우선
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel;
    }

    // aria-labelledby
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy);
      if (labelElement) {
        return labelElement.textContent?.trim();
      }
    }

    // label 태그 연결
    if (element instanceof HTMLInputElement || 
        element instanceof HTMLSelectElement || 
        element instanceof HTMLTextAreaElement) {
      const id = element.id;
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) {
          return label.textContent?.trim();
        }
      }
    }

    // title 속성
    const title = element.getAttribute('title');
    if (title) {
      return title;
    }

    return undefined;
  }

  /**
   * 요소 타입 결정
   */
  private getElementType(element: Element): ElementType {
    const tag = element.tagName.toLowerCase();
    const role = element.getAttribute('role');

    if (tag === 'button' || role === 'button') {
      return 'button';
    }

    if (tag === 'a' || role === 'link') {
      return 'link';
    }

    if (tag === 'select') {
      return 'select';
    }

    if (tag === 'textarea') {
      return 'textarea';
    }

    if (tag === 'input') {
      const type = (element as HTMLInputElement).type;
      if (type === 'checkbox') return 'checkbox';
      if (type === 'radio') return 'radio';
      return 'input';
    }

    if (element.tagName.includes('-')) {
      return 'custom';
    }

    return 'other';
  }

  /**
   * 요소가 시각적으로 보이는지 확인
   */
  private isVisible(element: Element): boolean {
    const tag = element.tagName.toLowerCase();
    
    // display: none 체크
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      this.log(`[SCANNER DEBUG] isVisible - ${element.tagName}: display/visibility hidden`);
      return false;
    }

    // opacity 체크 (완전 투명은 제외)
    if (parseFloat(style.opacity) === 0) {
      this.log(`[SCANNER DEBUG] isVisible - ${element.tagName}: opacity 0`);
      return false;
    }

    // aria-hidden
    if (element.getAttribute('aria-hidden') === 'true') {
      this.log(`[SCANNER DEBUG] isVisible - ${element.tagName}: aria-hidden=true`);
      return false;
    }

    // 크기 체크 (인터랙티브 요소는 크기 무시)
    const rect = element.getBoundingClientRect();
    const interactiveTags = ['input', 'button', 'select', 'textarea', 'a'];
    
    if (!interactiveTags.includes(tag)) {
      // 비인터랙티브 요소만 크기 체크
      if (rect.width === 0 && rect.height === 0) {
        this.log(`[SCANNER DEBUG] isVisible - ${element.tagName}: width=0 height=0`);
        return false;
      }
    }

    this.log(`[SCANNER DEBUG] isVisible - ${element.tagName}: VISIBLE (w=${rect.width}, h=${rect.height})`);
    return true;
  }

  /**
   * 우선순위 계산
   */
  private calculatePriority(element: Element): number {
    let score = 0;

    // data-llm-description 최우선
    if (element.hasAttribute('data-llm-description')) {
      score += 10;
    }

    // ARIA 레이블
    if (element.hasAttribute('aria-label') || element.hasAttribute('aria-describedby')) {
      score += 5;
    }

    // 주요 태그
    const tag = element.tagName.toLowerCase();
    if (['button', 'a', 'input', 'select', 'textarea'].includes(tag)) {
      score += 5;
    }

    // placeholder, title
    if (element.hasAttribute('placeholder') || element.hasAttribute('title')) {
      score += 3;
    }

    // ARIA Landmark (prioritizeLandmarks에 따라 점수 조정)
    const role = element.getAttribute('role');
    const landmarkRoles = ['main', 'navigation', 'search', 'form', 'banner', 'contentinfo', 'complementary', 'region'];
    if (role && landmarkRoles.includes(role)) {
      score += this.prioritizeLandmarks ? 12 : 8;  // 우선순위 플래그에 따라 점수 차등
    }

    // HTML5 Semantic Landmark 태그
    const landmarkTags = ['main', 'nav', 'header', 'footer', 'aside', 'section'];
    if (landmarkTags.includes(tag)) {
      score += this.prioritizeLandmarks ? 6 : 3;
    }

    // 가시성
    if (this.isVisible(element)) {
      score += 2;
    }

    return score;
  }

  /**
   * 요소 트리를 평탄화
   */
  private flattenElements(elements: ScannedElement[]): ScannedElement[] {
    const result: ScannedElement[] = [];

    const flatten = (element: ScannedElement) => {
      // priority가 -1인 요소는 제외 (컨테이너 요소)
      if (element.priority >= 0) {
        result.push(element);
      }
      if (element.children) {
        element.children.forEach(flatten);
      }
    };

    elements.forEach(flatten);
    this.log(`[SCANNER DEBUG] flattenElements() - result count: ${result.length}`);
    return result;
  }

  /**
   * 우선순위 기반 필터링
   */
  private filterByPriority(elements: ScannedElement[], maxElements: number): ScannedElement[] {
    return elements
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxElements);
  }

  /**
   * DOM 해시 생성 (변경 감지용)
   */
  private generateDOMHash(root: Element | ShadowRoot): string {
    const getHash = (element: Element | ShadowRoot): string => {
      if (element instanceof ShadowRoot) {
        return Array.from(element.children).map(child => getHash(child)).join('|');
      }
      
      const tag = element.tagName || '';
      const id = element.id || '';
      const classes = element.className || '';
      const childCount = element.children.length;
      
      return `${tag}:${id}:${classes}:${childCount}`;
    };

    return getHash(root);
  }

  /**
   * 디버그 로그 출력 (debug 모드일 때만)
   */
  private log(message: string, ...args: any[]): void {
    if (this.debug) {
      console.log(message, ...args);
    }
  }
}

