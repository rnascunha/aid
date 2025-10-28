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

export interface MessageProps {
  id: string;
  content: ChatMessage;
  timestamp: number;
  unread?: boolean;
  sender: ProviderProps | "You";
  attachment?: {
    fileName: string;
    type: string;
    size: number;
    file: string;
  };
}

export type ChatMessagesProps = Record<ProviderProps["id"], MessageProps[]>;

export type MessageRoleType = "user" | "assistant";
export interface MessageContext {
  role: MessageRoleType;
  content: string;
}
