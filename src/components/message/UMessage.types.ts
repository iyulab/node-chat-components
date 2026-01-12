/** 웹 페이지 출처 */
export interface WebCitationSource {
  type: "web";
  url: string;
  title: string;
  snippet?: string;
  favicon?: string;
  publishedAt?: string;
  accessedAt?: string;
}

/** 문서 파일 출처 */
export interface DocumentCitationSource {
  type: "document";
  title: string;
  snippet?: string;
  fileName?: string;
  fileType?: string;
  pageNumber?: number;
  author?: string;
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

/** 투표 상태 */
export type VoteState = 'none' | 'upvote' | 'downvote';

export interface TextBlockItem {
  type: "text";
  value?: string;
  /** 텍스트 내 citation 참조 위치들 */
  citationRefs?: CitationReference[];
}

export interface MarkdownBlockItem {
  type: "markdown";
  value?: string;
  /** 마크다운 내 citation 참조 위치들 */
  citationRefs?: CitationReference[];
}

export interface ThinkingBlockItem {
  type: "thinking";
  value?: string;
}

export type ToolBlockStatus = (
  "pending" |
  "paused" |
  "inProgress" |
  "success" | 
  "failure");

export interface ToolBlockItem {
  type: "tool";
  status: ToolBlockStatus;
  name?: string;
  input?: string;
  output?: string;
}

export type BlockItem = (
  TextBlockItem |
  MarkdownBlockItem |
  ThinkingBlockItem |
  ToolBlockItem
);