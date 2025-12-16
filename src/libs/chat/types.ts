export interface BaseSender {
  id: string;
  name: string;
}

interface ChatErrorMessage {
  code: number;
  error: string;
  detail: string;
}

export interface ChatSuccessMessage {
  success: true;
  response: string;
  data: object;
}

export type ChatMessage = ChatErrorMessage | ChatSuccessMessage;

export interface Attachment {
  name: string;
  size: number;
  type: string;
  data: string;
}

export interface MessageProps<T extends BaseSender> {
  id: string;
  content: ChatMessage;
  timestamp: number;
  sender: T | "You";
  attachment?: Attachment;
}

export type ChatMessagesProps<T extends BaseSender> = Record<
  string,
  MessageProps<T>[]
>;

export type MessageRoleType = "user" | "assistant" | "system";
export interface MessageContext {
  role: MessageRoleType;
  content: string;
}

/**
 *
 */
export interface ToolsProps {
  ip: string;
  geoLocationApiKey: string;
}
