import {
  deleteMessages,
  getAllMessages,
  MessageDB,
  onMessage,
} from "@/libs/chat/storage";
import { ChatMessagesProps, MessageProps, ModelProps } from "@/libs/chat/types";
import Dexie, { type Table } from "dexie";
import { AudioToTextSettings } from "./types";
import { filePathToBase64 } from "@/libs/base64";

export const audioToTextDB = new Dexie("AudioToTextStorage") as Dexie & {
  audioToTextMessages: Table<MessageDB, [string, string]>;
  settings: Table<AudioToTextSettings, string>;
};

audioToTextDB.version(1).stores({
  audioToTextMessages: "[id+contactId], contactId",
  settings: "",
});

/**
 * Messages
 */

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
  return await onMessage(audioToTextDB.audioToTextMessages, msg, contactId);
}

export async function getAllAudioToTextMessages(
  models: ModelProps[]
): Promise<ChatMessagesProps> {
  return await getAllMessages(audioToTextDB.audioToTextMessages, models);
}

export async function deleteAudioToTextMessages(modelId?: string) {
  await deleteMessages(audioToTextDB.audioToTextMessages, modelId);
}

/**
 * Models
 */
// export async function getAllModels() {
//   return await audioToTextDB.models.toArray();
// }

// async function addModel(model: ModelProps) {
//   await audioToTextDB.models.add(model);
// }

// async function removeModel(modelId: string) {
//   await Promise.all([
//     audioToTextDB.models.delete(modelId),
//     deleteMessages(audioToTextDB.audioToTextMessages, modelId),
//   ]);
// }

// export async function onAddRemoveModel(model: string | ModelProps) {
//   if (typeof model === "string") return await removeModel(model);
//   await addModel(model);
// }

/**
 * settings
 */
const defaultSettingsKey = "default";

export async function getSettings() {
  return await audioToTextDB.settings.get(defaultSettingsKey);
}

export async function updateSettings(s: AudioToTextSettings) {
  await audioToTextDB.settings.put(s, defaultSettingsKey);
}
