import { BaseSender, ChatMessagesProps } from "../types";

export type ADKState = Record<string, unknown>;

export interface SessionType extends BaseSender {
  state: ADKState;
}

export interface ADKData {
  chats: ChatMessagesProps;
  sessions: SessionType[];
}
