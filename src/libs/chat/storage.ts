import { Table } from "dexie";
import {
  Attachment,
  ChatMessage,
  ChatMessagesProps,
  MessageProps,
  ModelProps,
} from "./types";

/**
 * Messages
 */

export interface MessageDB {
  id: string;
  content: ChatMessage;
  timestamp: number;
  contactId: string;
  attachment?: Attachment;
  type: "sent" | "received";
}

type TableMessage = Table<MessageDB, [string, string], MessageDB>;

export async function onMessage(
  table: TableMessage,
  message: MessageProps,
  contactId: string
) {
  const msg: MessageDB = {
    id: message.id,
    content: message.content,
    timestamp: message.timestamp,
    contactId,
    attachment: message.attachment,
    type: message.sender === "You" ? "sent" : "received",
  };
  await table.add(msg);
}

export async function getAllMessages(
  table: TableMessage,
  models: ModelProps[]
): Promise<ChatMessagesProps> {
  const messages = await table.toArray();

  const baseChats = models.reduce((acc, m) => {
    acc[m.id] = [];
    return acc;
  }, {} as ChatMessagesProps);
  const chats = messages.reduce((acc, m) => {
    const sender =
      m.type === "sent" ? "You" : models.find((o) => o.id === m.contactId);
    if (!sender) return acc;
    if (!acc[m.contactId]) acc[m.contactId] = [];
    acc[m.contactId].push({
      id: m.id,
      content: m.content,
      attachment: m.attachment,
      sender,
      timestamp: m.timestamp,
    });
    return acc;
  }, baseChats);

  return chats;
}

export async function deleteModelMessages(
  table: TableMessage,
  modelId: string
) {
  await table.where("contactId").equals(modelId).delete();
}

export async function deleteAllMessages(
  table: Table<MessageDB, [string, string], MessageDB>
) {
  await table.clear();
}

export async function deleteMessages(table: TableMessage, modelId?: string) {
  await (modelId
    ? deleteModelMessages(table, modelId)
    : deleteAllMessages(table));
}
