export interface TextMessageContent {
  type: "text";
  value?: string;
}

export interface FileMessageContent {
  type: "file";
  contentType?: string;
  dataFormat?: "text" | "base64" | "url";
  data?: string;
}

export interface ToolMessageContent {
  type: "tool";
  isCompleted?: boolean;
  isApproved?: boolean;
  id?: string;
  name?: string;
  input?: string;
  output?: { isSuccess: boolean; data: string };
}

export interface ThinkingMessageContent {
  type: "thinking";
  id?: string;
  format?: "detailed" | "secure" | "summary";
  value?: string;
}

export type MessageContent = (
  TextMessageContent |
  FileMessageContent |
  ToolMessageContent |
  ThinkingMessageContent);

export interface UserMessage {
  id?: string;
  role: "user";
  content?: MessageContent[];
  timestamp?: string;
}

export interface AssistantMessage {
  id?: string;
  role: "assistant";
  name?: string;
  avatar?: string;
  content: MessageContent[];
  timestamp?: string;
}

export type Message = UserMessage | AssistantMessage;
