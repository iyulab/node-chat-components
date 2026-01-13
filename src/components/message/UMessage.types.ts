/** 웹 페이지 출처 */
export interface WebCitationSource {
  type: "web";
  title: string;
  snippet?: string;
  url: string;
  favicon?: string;
}

/** 문서 파일 출처 */
export interface DocumentCitationSource {
  type: "document";
  title: string;
  snippet?: string;
  fileName?: string;
  fileType?: string;
}

/** 모든 출처 타입의 유니온 */
export type CitationSource = 
  | WebCitationSource 
  | DocumentCitationSource;

/**
 * 메시지 컨텐츠 내에서 citation이 참조되는 위치
 */
export interface CitationReference {
  /** citation ID (citations 배열의 인덱스) */
  citationId: number;
  /** 텍스트 내 시작 위치 (문자 인덱스) */
  startIndex: number;
  /** 텍스트 내 종료 위치 (문자 인덱스) */
  endIndex: number;
}

export interface ThinkingBlockItem {
  type: "thinking";
  /** 추론 텍스트 내용 */
  value?: string;
}

export interface TextBlockItem {
  type: "text";
  /** 텍스트 내용 */
  value?: string;
  /** 텍스트 내 citation 참조 위치들 */
  refs?: CitationReference[];
}

export interface MarkdownBlockItem {
  type: "markdown";
  /** 마크다운 텍스트 */
  value?: string;
  /** 마크다운 내 citation 참조 위치들 */
  refs?: CitationReference[];
}

export interface ToolBlockItem {
  type: "tool";
  /** 도구 블록 제목 */
  title?: string;
  /** 도구 블록 입력(json) */
  input?: string;
  /** 도구 블록 출력(json) */
  output?: string;
}

export type BlockItem = (
  ThinkingBlockItem |
  TextBlockItem |
  MarkdownBlockItem |
  ToolBlockItem
);