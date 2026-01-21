import Dexie from "dexie";
import { StorageStoreType } from "./types";
import {
  ChatbotStorageIndexDB,
  StorageAudioToTextIndexDB,
  StorageChatIndexDB,
  StorageGeneralIndexDB,
} from "./storageIndexDB";

export const aISettings = new Dexie("AISettings") as StorageStoreType;

aISettings.version(1).stores({
  // General
  providers: "id",
  tools: "",
  // Chat
  chatMessages: "[id+senderId], senderId, timestamp",
  chatModels: "id, providerId",
  chatSettings: "",
  // Audio to Text
  audioToTextMessages: "[id+senderId], senderId, timestamp",
  audioToTextModels: "id, providerId",
  audioToTextSettings: "",
  // Chatbot
  chatbotMessages: "[id+senderId], senderId, timestamp",
  chatbotSessions: "id",
});

export let generalStorage: StorageGeneralIndexDB | null = null;
export let chatStorage: StorageChatIndexDB | null = null;
export let audioToTextStorage: StorageAudioToTextIndexDB | null = null;
export let chatbotStorage: ChatbotStorageIndexDB | null = null;

aISettings.open().then(() => {
  generalStorage = new StorageGeneralIndexDB(
    aISettings,
    aISettings.providers,
    aISettings.tools,
    aISettings.chatModels,
    aISettings.chatMessages,
    aISettings.audioToTextModels,
    aISettings.audioToTextMessages,
  );
  chatStorage = new StorageChatIndexDB(
    aISettings.chatMessages,
    aISettings.chatModels,
    aISettings.chatSettings,
  );
  audioToTextStorage = new StorageAudioToTextIndexDB(
    aISettings.audioToTextMessages,
    aISettings.audioToTextModels,
    aISettings.audioToTextSettings,
  );
  chatbotStorage = new ChatbotStorageIndexDB(
    aISettings.chatbotMessages,
    aISettings.chatbotSessions,
  );
});
