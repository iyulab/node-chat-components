import type { ReferenceSource, ReferenceCitation } from "./References";

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

/** 파일 하나의 데이터 구조입니다. */
export interface FileBlockItem {
  type: "file";
  /** 파일 이름 */
  name?: string;
  /** 파일 크기 (bytes) */
  size?: number;
  /** MIME 타입 (예: "image/png", "application/pdf") */
  mimeType?: string;
  /** 다운로드 URL */
  url?: string;
  /** 실제 파일 데이터 (선택적, 필요에 따라 사용) */
  data?: any;
}

/** 출처 정보 */
export interface ReferenceBlockItem {
  type: "reference";
  /** 출처 목록 */
  sources: ReferenceSource[];
}

/**
 * 타입별 메시지 컨텐츠 아이템
 */
export type BlockItem = (
  TextBlockItem |
  MarkdownBlockItem |
  FileBlockItem |
  ReferenceBlockItem
);
