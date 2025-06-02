import type {
  MessageContent
} from "./MessageContent";

interface MessageBase {
  id?: string;
  timestamp?: string;
}

export interface UserMessage extends MessageBase {
  role: "user";
  content?: MessageContent[];
}

export interface AssistantMessage extends MessageBase {
  role: "assistant";
  name?: string;
  avatar?: string;
  content: MessageContent[];
}

export type Message = UserMessage | AssistantMessage;
