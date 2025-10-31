import { StaticImageData } from "next/image";

export interface ProviderProps {
  id: string;
  name: string;
  logo: StaticImageData;
  provider: string;
}

export interface ModelProps {
  id: string;
  providerId: string;
  name: string;
  model: string;
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
  sender: ModelProps | "You";
  attachment?: Attachment;
}

export type ChatMessagesProps = Record<ModelProps["id"], MessageProps[]>;

export type MessageRoleType = "user" | "assistant" | "system";
export interface MessageContext {
  role: MessageRoleType;
  content: string;
}
