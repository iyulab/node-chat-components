import { JsonNode } from "../viewers/UJsonViewer.lib.js";

/**
 * 메시지 컨텐츠 내에서 citation이 참조되는 위치
 */
export interface Citation {
  /** 인용 출처 이름 */
  name: string;
  type: 'web';
  title: string;
  url: string;
  snippet?: string;
  favicon?: string;
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
}

export interface MarkdownBlockItem {
  type: "markdown";
  /** 마크다운 텍스트 */
  value?: string;
  /** 마크다운 내 인용 출처들 */
  citations?: Citation[];
}

export interface ToolBlockItem {
  type: "tool";
  /** 도구 블록 제목 */
  title?: string;
  /** 도구 블록 입력(json) */
  input?: JsonNode;
  /** 도구 블록 출력(json) */
  output?: JsonNode;
}

export type BlockItem = (
  ThinkingBlockItem |
  TextBlockItem |
  MarkdownBlockItem |
  ToolBlockItem
);