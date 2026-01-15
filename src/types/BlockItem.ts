import type { BlockReference } from "./BlockReference";
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
  /** 마크다운 내 인용 출처들 */
  refs?: BlockReference[];
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

/**
 * 타입별 메시지 컨텐츠 아이템
 */
export type BlockItem = (
  ThinkingBlockItem |
  TextBlockItem |
  MarkdownBlockItem |
  ToolBlockItem
);