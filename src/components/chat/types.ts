import { StaticImageData } from "next/image";

export interface ProviderProps {
  id: string;
  name: string;
  logo: StaticImageData;
  provider: string;
  model: string;
  online: boolean;
}

interface ChatErrorMessage {
  error: string;
  detail: string;
}

export interface ChatSuccessMessage {
  success: true;
  response: string;
}

export type ChatMessage = ChatErrorMessage | ChatSuccessMessage;

export interface Attachment {
  name: string;
  size: number;
  type: string;
  data: string;
}

export interface MessageProps {
  id: string;
  content: ChatMessage;
  timestamp: number;
  unread?: boolean;
  sender: ProviderProps | "You";
  attachment?: Attachment;
}

export type ChatMessagesProps = Record<ProviderProps["id"], MessageProps[]>;

export type MessageRoleType = "user" | "assistant" | "system";
export interface MessageContext {
  role: MessageRoleType;
  content: string;
}
