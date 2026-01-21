import { BaseSender, ChatMessagesProps } from "@/libs/chat/types";

export interface SessionType extends BaseSender {
  state: Record<string, unknown>;
}

export interface ChatbotData {
  chats: ChatMessagesProps;
  sessions: SessionType[];
}
