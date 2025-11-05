import { ChatSettings } from "@/appComponents/chat/types";
import {
  deleteMessages,
  getAllMessages,
  MessageDB,
  onMessage,
} from "@/libs/chat/storage";
import { ChatMessagesProps, MessageProps, ModelProps } from "@/libs/chat/types";
import Dexie, { type Table } from "dexie";

export const audioToTextDB = new Dexie("AudioToTextStorage") as Dexie & {
  audioToTextMessages: Table<MessageDB, [string, string]>;
  models: Table<ModelProps, string>;
  settings: Table<ChatSettings, string>;
};

audioToTextDB.version(1).stores({
  audioToTextMessages: "[id+contactId], contactId",
  // models: "id",
  settings: "",
});

/**
 * Messages
 */

export async function onAudioToTextMessage(
  message: MessageProps,
  contactId: string
) {
  return await onMessage(audioToTextDB.audioToTextMessages, message, contactId);
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

export async function updateSettings(s: ChatSettings) {
  await audioToTextDB.settings.put(s, defaultSettingsKey);
}
