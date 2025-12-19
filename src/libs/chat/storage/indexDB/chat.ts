import { ChatSettings } from "@/appComponents/chat/types";
import {
  deleteMessages,
  getAllMessages,
  getAllSenders,
  onAddRemoveSender,
  onMessage,
} from "./functions";
import { aISettings } from "./store";
import { ModelProps } from "@/libs/chat/models/types";
import { ChatMessagesProps, MessageProps } from "../../types";

/**
 * Messages
 */
export async function onChatMessage(message: MessageProps | MessageProps[]) {
  await onMessage(aISettings.chatMessages, message);
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
  return getAllSenders(aISettings.chatModels);
}

export async function onAddRemoveChatModel(model: string | ModelProps) {
  onAddRemoveSender(aISettings.chatModels, model, aISettings.chatMessages);
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
