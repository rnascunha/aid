/**
 * Messages
 */

import { filePathToBase64 } from "@/libs/base64";
import { ChatMessagesProps, MessageProps, ModelProps } from "../../types";
import {
  deleteMessages,
  getAllMessages,
  onAddRemoveModel,
  onMessage,
} from "./functions";
import { aISettings } from "./store";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";

export async function onAudioToTextMessage(
  message: MessageProps,
  contactId: string
) {
  const msg = !message.attachment
    ? message
    : {
        ...message,
        attachment: {
          ...message.attachment,
          data: await filePathToBase64(
            message.attachment.data,
            message.attachment.type,
            true
          ),
        },
      };
  return await onMessage(aISettings.audioToTextMessages, msg, contactId);
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
  await onAddRemoveModel(
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
