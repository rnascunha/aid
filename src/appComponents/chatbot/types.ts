import { ChatMessagesProps, MessageProps } from "@/libs/chat/types";

export interface SessionType {
  id: string;
  name: string;
  state: Record<string, unknown>;
}

export type MessageChatbotProps = MessageProps<SessionType>;
export type ChatMessagesChatbotProps = ChatMessagesProps<SessionType>;
