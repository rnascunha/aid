import { BaseSender, ChatMessagesProps } from "@/libs/chat/types";

export interface SessionType extends BaseSender {
  state: Record<string, unknown>;
}

export interface AgentTravelerData {
  chats: ChatMessagesProps;
  sessions: SessionType[];
}
