import { deleteMessages, getAllMessages, onMessage } from "./functions";
import { aISettings } from "./store";
import {
  ChatMessagesChatbotProps,
  MessageChatbotProps,
  SessionType,
} from "@/appComponents/chatbot/types";
import { TableChatbotSessions, TableMessages } from "./types";

/**
 * Messages
 */
export async function onChatbotMessage(
  message: MessageChatbotProps,
  contactId: string
) {
  await onMessage(aISettings.chatbotMessages, message, contactId);
}

export async function getAllChatbotMessages(
  sessions: SessionType[]
): Promise<ChatMessagesChatbotProps> {
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
  table: TableChatbotSessions,
  session: SessionType
) {
  await table.put(session);
}

async function removeSession(
  table: TableChatbotSessions,
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
