export interface TextBlockContent {
  type: "text";
  value?: string;
}

export interface MarkdownBlockContent {
  type: "markdown";
  value?: string;
}

export interface ThinkingBlockContent {
  type: "thinking";
  value?: string;
}

export type ToolBlockStatus = "WAITING" | "PENDING_APPROVAL" | "EXECUTING" | "SUCCESS" | "FAILED";

export interface ToolBlockContent {
  type: "tool";
  status: ToolBlockStatus;
  name?: string;
  input?: string;
  output?: string;
}

export type BlockContent = (
  TextBlockContent |
  MarkdownBlockContent |
  ThinkingBlockContent |
  ToolBlockContent
);
