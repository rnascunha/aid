import { ChatSettings } from "@/appComponents/chat/types";
import { ChatMessagesProps, MessageProps, ModelProps } from "../../types";
import {
  deleteMessages,
  getAllMessages,
  getAllModels,
  onAddRemoveModel,
  onMessage,
} from "./functions";
import { aISettings } from "./store";

/**
 * Messages
 */
export async function onChatMessage(message: MessageProps, contactId: string) {
  await onMessage(aISettings.chatMessages, message, contactId);
}

export async function getAllChatMessages(
  models: ModelProps[]
): Promise<ChatMessagesProps> {
  return await getAllMessages(aISettings.chatMessages, models);
}

export async function deleteChatMessages(modelId?: string) {
  await deleteMessages(aISettings.chatMessages, modelId);
}

/**
 * Models
 */

export async function getAllChatModels() {
  return getAllModels(aISettings.chatModels);
}

export async function onAddRemoveChatModel(model: string | ModelProps) {
  onAddRemoveModel(aISettings.chatModels, model, aISettings.chatMessages);
}

/**
 * settings
 */
const defaultSettingsKey = "defaultChatKey";

export async function getChatSettings() {
  return await aISettings.chatSettings.get(defaultSettingsKey);
}

export async function updateChatSettings(s: ChatSettings) {
  await aISettings.chatSettings.put(s, defaultSettingsKey);
}
