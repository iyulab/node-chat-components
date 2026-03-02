import type { ReferenceSource, ReferenceCitation } from "./References";
import type { JsonNode } from "./JsonNode";

/** LLM 추론 텍스트 블록입니다. */
export interface ThinkingBlockItem {
  type: "thinking";
  /** 추론 텍스트 내용 */
  value?: string;
}

/** 일반 텍스트 블록입니다. */
export interface TextBlockItem {
  type: "text";
  /** 텍스트 내용 */
  value?: string;
}

/** 마크다운 텍스트 블록입니다. */
export interface MarkdownBlockItem {
  type: "markdown";
  /** 마크다운 텍스트 */
  value?: string;
  /** 마크다운 내 인용 정보 들 */
  refs?: ReferenceCitation[];
}

/** 툴 사용 블록입니다. */
export interface ToolBlockItem {
  type: "tool";
  /** 도구 블록 제목 */
  title?: string;
  /** 도구 블록 입력값(json) */
  input?: JsonNode;
  /** 도구 블록 출력값(json) */
  output?: JsonNode;
}

/** 출처 정보 */
export interface ReferenceBlockItem {
  type: "reference";
  /** 출처 목록 */
  sources: ReferenceSource[];
}

/** 파일 하나의 데이터 구조입니다. */
export interface FileItem {
  /** 파일 이름 */
  name: string;
  /** 파일 크기 (bytes) */
  size?: number;
  /** MIME 타입 (예: "image/png", "application/pdf") */
  mimeType?: string;
  /** 다운로드 URL */
  url?: string;
}

/** 복수 파일 첨부 블록입니다. */
export interface FilesBlockItem {
  type: "files";
  /** 파일 목록 */
  files: FileItem[];
  /** 삭제 버튼 표시 여부 */
  removable?: boolean;
}

/**
 * 타입별 메시지 컨텐츠 아이템
 */
export type BlockItem = (
  ThinkingBlockItem |
  TextBlockItem |
  MarkdownBlockItem |
  ToolBlockItem |
  ReferenceBlockItem |
  FilesBlockItem
);
