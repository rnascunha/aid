import { ChatSettings } from "@/appComponents/chat/types";
import { deleteMessages, getAllMessages, onMessage } from "@/libs/chat/storage";
import {
  Attachment,
  ChatMessage,
  ChatMessagesProps,
  MessageProps,
  ModelProps,
} from "@/libs/chat/types";
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

export async function onChatMessage(message: MessageProps, contactId: string) {
  return await onMessage(chatDB.chatMessages, message, contactId);
}

export async function getAllChatMessages(
  models: ModelProps[]
): Promise<ChatMessagesProps> {
  return await getAllMessages(chatDB.chatMessages, models);
}

export async function deleteChatMessages(modelId?: string) {
  await deleteMessages(chatDB.chatMessages, modelId);
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
    deleteChatMessages(modelId),
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
