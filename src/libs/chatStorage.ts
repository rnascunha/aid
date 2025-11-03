import { ChatSettings } from "@/appComponents/chat/types";
import {
  Attachment,
  ChatMessage,
  ChatMessagesProps,
  MessageProps,
  ModelProps,
} from "@/components/chat/types";
import Dexie, { type Table } from "dexie";

interface MessageDB {
  id: string;
  content: ChatMessage;
  timestamp: number;
  contactId: string;
  attachment?: Attachment;
  type: "sent" | "received";
}

export const chatDB = new Dexie("ChatStorage") as Dexie & {
  chatMessages: Table<MessageDB, [string, string]>;
  models: Table<ModelProps, string>;
  settings: Table<ChatSettings, string>;
};

chatDB.version(1).stores({
  chatMessages: "[id+contactId], contactId",
  models: "id",
  settings: "",
});

/**
 * Messages
 */

export async function onMessage(message: MessageProps, contactId: string) {
  const msg: MessageDB = {
    id: message.id,
    content: message.content,
    timestamp: message.timestamp,
    contactId,
    attachment: message.attachment,
    type: message.sender === "You" ? "sent" : "received",
  };
  await chatDB.chatMessages.add(msg);
}

export async function getAllMessages(
  models: ModelProps[]
): Promise<ChatMessagesProps> {
  const messages = await chatDB.chatMessages.toArray();

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

async function deleteModelMessages(modelId: string) {
  await chatDB.chatMessages.where("contactId").equals(modelId).delete();
}

async function deleteAllMessages() {
  await chatDB.chatMessages.clear();
}

export async function deleteMessages(modelId?: string) {
  await (modelId ? deleteModelMessages(modelId) : deleteAllMessages());
}

/**
 * Models
 */

export async function getAllModels() {
  return await chatDB.models.toArray();
}

async function addModel(model: ModelProps) {
  await chatDB.models.add(model);
}

async function removeModel(modelId: string) {
  await Promise.all([
    chatDB.models.delete(modelId),
    deleteModelMessages(modelId),
  ]);
}

export async function onAddRemoveModel(model: string | ModelProps) {
  if (typeof model === "string") return await removeModel(model);
  await addModel(model);
}

/**
 * settings
 */
const defaultSettingsKey = "default";

export async function getSettings() {
  return await chatDB.settings.get(defaultSettingsKey);
}

export async function updateSettings(s: ChatSettings) {
  await chatDB.settings.put(s, defaultSettingsKey);
}
