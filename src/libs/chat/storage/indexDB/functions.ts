import { ModelProps } from "@/components/chat/model/types";
import { MessageDB, TableMessages, TableModels } from "./types";
import { BaseSender, ChatMessagesProps, MessageProps } from "../../types";

export async function onMessage<T extends BaseSender>(
  table: TableMessages,
  message: MessageProps<T> | MessageProps<T>[],
  contactId: string
) {
  if (!Array.isArray(message)) message = [message];
  const msgs: MessageDB[] = message.map((m) => ({
    id: m.id,
    content: m.content,
    timestamp: m.timestamp,
    contactId,
    attachment: m.attachment,
    type: m.sender === "You" ? "sent" : "received",
  }));
  await table.bulkAdd(msgs);
}

export async function getAllMessages<T extends BaseSender>(
  table: TableMessages,
  senders: BaseSender[]
): Promise<ChatMessagesProps<T>> {
  const messages = await table.toArray();

  const baseChats = senders.reduce((acc, m) => {
    acc[m.id] = [];
    return acc;
  }, {} as ChatMessagesProps<T>);
  const chats = messages.reduce((acc, m) => {
    const sender =
      m.type === "sent" ? "You" : senders.find((o) => o.id === m.contactId);
    if (!sender) return acc;
    if (!acc[m.contactId]) acc[m.contactId] = [];
    acc[m.contactId].push({
      id: m.id,
      content: m.content,
      attachment: m.attachment,
      sender: sender as "You" | T,
      timestamp: m.timestamp,
    });
    return acc;
  }, baseChats);

  return chats;
}

export async function deleteModelMessages(
  table: TableMessages,
  modelId: string
) {
  await table.where("contactId").equals(modelId).delete();
}

export async function deleteAllMessages(table: TableMessages) {
  await table.clear();
}

export async function deleteMessages(table: TableMessages, modelId?: string) {
  if (!modelId) {
    deleteAllMessages(table);
    return;
  }

  deleteModelMessages(table, modelId);
}

/**
 * Models
 */
export async function getAllModels(table: TableModels) {
  return await table.toArray();
}

async function updateModel(table: TableModels, model: ModelProps) {
  await table.put(model);
}

async function removeModel(
  table: TableModels,
  modelId: string,
  tableMessages: TableMessages
) {
  await Promise.all([
    table.delete(modelId),
    deleteMessages(tableMessages, modelId),
  ]);
}

export async function onAddRemoveModel(
  table: TableModels,
  model: string | ModelProps,
  tableMessages: TableMessages
) {
  if (typeof model === "string") {
    return await removeModel(table, model, tableMessages);
  }
  await updateModel(table, model);
}

export async function deleteModelFromProviderId(
  table: TableModels,
  providerId: string,
  tableMessages: TableMessages
) {
  const allModels = await table
    .where("providerId")
    .equals(providerId)
    .toArray();
  await Promise.all([
    table.where("providerId").equals(providerId).delete(),
    ...allModels.map((p) => deleteModelMessages(tableMessages, p.id)),
  ]);
}
