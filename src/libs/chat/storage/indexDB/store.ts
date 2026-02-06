import Dexie from "dexie";
import { StorageStoreType } from "./types";
import {
  StorageChatbotIndexDB,
  StorageAudioToTextIndexDB,
  StorageChatIndexDB,
  StorageGeneralIndexDB,
  StorageAgentTravelerIndexDB,
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
  // Agent Traveler
  agentTravelerMessages: "[id+senderId], senderId, timestamp",
  agentTravelerSessions: "id",
});

export let generalStorage: StorageGeneralIndexDB | null = null;
export let chatStorage: StorageChatIndexDB | null = null;
export let audioToTextStorage: StorageAudioToTextIndexDB | null = null;
export let chatbotStorage: StorageChatbotIndexDB | null = null;
export let agentTravelerStorage: StorageAgentTravelerIndexDB | null = null;

aISettings.open().then(() => {
  generalStorage = new StorageGeneralIndexDB(aISettings);
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
  chatbotStorage = new StorageChatbotIndexDB(
    aISettings.chatbotMessages,
    aISettings.chatbotSessions,
  );
  agentTravelerStorage = new StorageChatbotIndexDB(
    aISettings.agentTravelerMessages,
    aISettings.agentTravelerSessions,
  );
});
