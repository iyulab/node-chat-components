export interface TextBlockItem {
  type: "text";
  value?: string;
}

export interface MarkdownBlockItem {
  type: "markdown";
  value?: string;
}

export interface ThinkingBlockItem {
  type: "thinking";
  value?: string;
}

export type ToolBlockStatus = (
  "waiting" | 
  "paused" | 
  "approved" |
  "rejected" |
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
