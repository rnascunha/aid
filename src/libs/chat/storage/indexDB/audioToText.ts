/**
 * Messages
 */
import {
  deleteMessages,
  getAllMessages,
  onAddRemoveSender,
  onMessage,
} from "./functions";
import { aISettings } from "./store";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { ModelProps } from "@/libs/chat/models/types";
import { ChatMessagesProps, MessageProps } from "../../types";

export async function onAudioToTextMessage(
  message: MessageProps | MessageProps[]
) {
  return await onMessage(aISettings.audioToTextMessages, message);
}

export async function getAllAudioToTextMessages(
  models: ModelProps[]
): Promise<ChatMessagesProps> {
  return await getAllMessages(aISettings.audioToTextMessages, models);
}

export async function deleteAudioToTextMessages(modelId?: string) {
  await deleteMessages(aISettings.audioToTextMessages, modelId);
}

/**
 * Models
 */
export async function getAllAudioToTextModels() {
  return await aISettings.audioToTextModels.toArray();
}

export async function onAddAudioToTextRemoveModel(model: string | ModelProps) {
  await onAddRemoveSender(
    aISettings.audioToTextModels,
    model,
    aISettings.audioToTextMessages
  );
}

/**
 * settings
 */
const defaultSettingsKey = "defaultAudioToText";

export async function getAudioToTextSettings() {
  return await aISettings.audioToTextSettings.get(defaultSettingsKey);
}

export async function updateAudioToTextSettings(s: AudioToTextSettings) {
  await aISettings.audioToTextSettings.put(s, defaultSettingsKey);
}
