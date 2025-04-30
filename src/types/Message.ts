import type { 
  UserMessageContent,
  AssistantMessageContent
} from "./MessageContent";

interface MessageBase {
  avatar?: string;
  name?: string;
  timestamp?: string;
}

export interface UserMessage extends MessageBase {
  role: "user";

  content?: UserMessageContent[];
}

export interface AssistantMessage extends MessageBase {
  role: "assistant";

  content?: AssistantMessageContent[];
}

export type Message = UserMessage | AssistantMessage;
