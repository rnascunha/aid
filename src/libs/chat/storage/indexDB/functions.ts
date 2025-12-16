import {
  ChatMessagesModelProps,
  MessageModelProps,
  ModelProps,
} from "@/components/chat/model/types";
import { MessageDB, TableMessages, TableModels } from "./types";

export async function onMessage(
  table: TableMessages,
  message: MessageModelProps,
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
  table: TableMessages,
  models: ModelProps[]
): Promise<ChatMessagesModelProps> {
  const messages = await table.toArray();

  const baseChats = models.reduce((acc, m) => {
    acc[m.id] = [];
    return acc;
  }, {} as ChatMessagesModelProps);
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
  table: TableMessages,
  modelId: string
) {
  await table.where("contactId").equals(modelId).delete();
}

export async function deleteAllMessages(table: TableMessages) {
  await table.clear();
}

export async function deleteMessages(table: TableMessages, modelId?: string) {
  await (modelId
    ? deleteModelMessages(table, modelId)
    : deleteAllMessages(table));
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
