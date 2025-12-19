import { TableMessages, TableSenders } from "./types";
import { BaseSender, ChatMessagesProps, MessageProps } from "../../types";

/**
 * Messages
 */

export async function onMessage(
  table: TableMessages,
  messages: MessageProps | MessageProps[]
) {
  if (!Array.isArray(messages)) messages = [messages];
  await table.bulkAdd(messages);
}

export async function getAllMessages(
  table: TableMessages,
  senders: BaseSender[]
): Promise<ChatMessagesProps> {
  const messages = await table.toArray();

  // Creating Senders
  const baseChats = senders.reduce((acc, m) => {
    acc[m.id] = [];
    return acc;
  }, {} as ChatMessagesProps);

  const chats = messages.reduce((acc, m) => {
    if (!acc[m.senderId]) acc[m.senderId] = [];
    acc[m.senderId].push(m);
    return acc;
  }, baseChats);

  return chats;
}

export async function deleteSenderMessages(
  table: TableMessages,
  senderId: string
) {
  await table.where("senderId").equals(senderId).delete();
}

export async function deleteAllMessages(table: TableMessages) {
  await table.clear();
}

export async function deleteMessages(table: TableMessages, senderId?: string) {
  if (!senderId) {
    deleteAllMessages(table);
    return;
  }

  deleteSenderMessages(table, senderId);
}

/**
 * Senders
 */
export async function getAllSenders(table: TableSenders) {
  return await table.toArray();
}

async function updateSender(table: TableSenders, sender: BaseSender) {
  await table.put(sender);
}

async function removeSender(
  table: TableSenders,
  senderId: string,
  tableMessages: TableMessages
) {
  await Promise.all([
    table.delete(senderId),
    deleteMessages(tableMessages, senderId),
  ]);
}

export async function onAddRemoveSender(
  table: TableSenders,
  sender: string | BaseSender,
  tableMessages: TableMessages
) {
  if (typeof sender === "string") {
    return await removeSender(table, sender, tableMessages);
  }
  await updateSender(table, sender);
}

/**
 * Provider/Model
 */

export async function deleteModelFromProviderId(
  table: TableSenders,
  providerId: string,
  tableMessages: TableMessages
) {
  const allModels = await table
    .where("providerId")
    .equals(providerId)
    .toArray();
  await Promise.all([
    table.where("providerId").equals(providerId).delete(),
    ...allModels.map((p) => deleteSenderMessages(tableMessages, p.id)),
  ]);
}
