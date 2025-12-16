import { Table } from "dexie";
import { Attachment, ChatMessage, ToolsProps } from "../../types";
import { ModelProps } from "@/components/chat/model/types";
import { SessionType } from "@/appComponents/chatbot/types";

export interface MessageDB {
  id: string;
  content: ChatMessage;
  timestamp: number;
  contactId: string;
  attachment?: Attachment;
  type: "sent" | "received";
}

export type ToolsDB = Omit<ToolsProps, "ip">;

export type TableMessages = Table<MessageDB, [string, string]>;
export type TableModels = Table<ModelProps, string>;

export type TableChatbotSessions = Table<SessionType, string>;
