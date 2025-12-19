import { deleteMessages, getAllMessages, onMessage } from "./functions";
import { aISettings } from "./store";
import { SessionType } from "@/appComponents/chatbot/types";
import { TableSenders, TableMessages } from "./types";
import { ChatMessagesProps, MessageProps } from "../../types";

/**
 * Messages
 */
export async function onChatbotMessage(message: MessageProps | MessageProps[]) {
  await onMessage(aISettings.chatbotMessages, message);
}

export async function getAllChatbotMessages(
  sessions: SessionType[]
): Promise<ChatMessagesProps> {
  return await getAllMessages(aISettings.chatbotMessages, sessions);
}

export async function deleteChatbotMessages(sessionId?: string) {
  await deleteMessages(aISettings.chatbotMessages, sessionId);
}

/**
 * Session
 */
export async function getAllSessions() {
  return await aISettings.chatbotSessions.toArray();
}

async function updateSession(
  table: TableSenders,
  session: SessionType | SessionType[]
) {
  if (!Array.isArray(session)) session = [session];
  await table.bulkPut(session);
}

async function removeSession(
  table: TableSenders,
  sessionId: string,
  tableMessages: TableMessages
) {
  await Promise.all([
    table.delete(sessionId),
    deleteMessages(tableMessages, sessionId),
  ]);
}

export async function onAddRemoveSession(session: string | SessionType) {
  if (typeof session === "string") {
    return await removeSession(
      aISettings.chatbotSessions,
      session,
      aISettings.chatbotMessages
    );
  }
  await updateSession(aISettings.chatbotSessions, session);
}
