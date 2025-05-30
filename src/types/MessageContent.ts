export interface MessageContentBase {
  id?: string;
  index?: number;
}

export interface TextContent extends MessageContentBase {
  type: "text";
  value?: string;
}

export interface ImageContent extends MessageContentBase {
  type: "file";
  data?: string;
}

export type ToolExecutionStatus = "pending" | "running" | "completed";

export type ToolApprovalStatus = "notRequired" | "requires" | "approved" | "rejected";

export interface ToolContent extends MessageContentBase {
  type: "tool";
  isCompleted?: boolean;
  approvalStatus: ToolApprovalStatus;
  name?: string;
  arguments?: any;
  result?: { isSuccess: boolean; data: string };
}

export interface ThinkingContent extends MessageContentBase {
  type: "thinking";
  value?: string;
}

export type UserMessageContent = TextContent | ImageContent;

export type AssistantMessageContent = TextContent | ToolContent | ThinkingContent;
