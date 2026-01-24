import { ModelProps } from "../models/types";
import {
  AudioToTextStorageBase,
  ChatbotStorageBase,
  ChatStorageBase,
  StorageGeneralBase,
} from "./storageBase";
import { DBExportFormatV1 } from "./types";

export async function exportStorage({
  general,
  chat,
  audioToText,
  chatbot,
}: {
  general: StorageGeneralBase;
  chat: ChatStorageBase;
  audioToText: AudioToTextStorageBase;
  chatbot: ChatbotStorageBase;
}): Promise<DBExportFormatV1> {
  const [
    providers,
    tools,
    chatModels,
    chatSettings,
    audioToTextModels,
    audioToTextSettings,
    chatbotSenders,
  ] = await Promise.all([
    general.getProviders(),
    general.getTools(),
    chat.getSenders(),
    chat.getSettings(),
    audioToText.getSenders(),
    audioToText.getSettings(),
    chatbot.getSenders(),
  ]);

  const [chatMessages, audioToTextMessages, chatbotMessages] =
    await Promise.all([
      chat.getMessages(chatModels.map((m) => m.id)),
      audioToText.getMessages(audioToTextModels.map((m) => m.id)),
      chatbot.getMessages(chatbotSenders.map((m) => m.id)),
    ]);

  return {
    version: 1,
    providers,
    tools,
    chatMessages: Object.values(chatMessages).flat(),
    chatModels: chatModels as ModelProps[],
    chatSettings,
    audioToTextMessages: Object.values(audioToTextMessages).flat(),
    audioToTextModels: audioToTextModels as ModelProps[],
    audioToTextSettings,
    chatbotMessages: Object.values(chatbotMessages).flat(),
    chatbotSenders,
  };
}

export async function importStorage(
  {
    general,
    chat,
    audioToText,
    chatbot,
  }: {
    general: StorageGeneralBase;
    chat: ChatStorageBase;
    audioToText: AudioToTextStorageBase;
    chatbot: ChatbotStorageBase;
  },
  data: DBExportFormatV1,
) {
  await Promise.all([
    general.addProvider(data.providers),
    data.tools ? general.updateTools({ ip: "", ...data.tools }) : undefined,
    chat.addMessage(data.chatMessages),
    chat.addSender(data.chatModels),
    data.chatSettings ? chat.updateSettings(data.chatSettings) : undefined,
    audioToText.addMessage(data.audioToTextMessages),
    audioToText.addSender(data.audioToTextModels),
    data.audioToTextSettings
      ? audioToText.updateSettings(data.audioToTextSettings)
      : undefined,
    chatbot.addMessage(data.chatbotMessages),
    chatbot.addSender(data.chatbotSenders),
  ]);
}
