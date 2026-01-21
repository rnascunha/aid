import Dexie, { Table } from "dexie";
import {
  TableAudioToTextSettings,
  TableChatSettings,
  TableMessages,
  TableSenders,
  ToolsDB,
} from "./types";
import { ProviderProps } from "@/libs/chat/models/types";
import {
  StorageAudioToTextIndexDB,
  StorageChatIndexDB,
} from "./storageIndexDB";

export const aISettings = new Dexie("AISettings") as Dexie & {
  // General
  providers: Table<ProviderProps, string>;
  tools: Table<ToolsDB, string>;
  // Chat
  chatMessages: TableMessages;
  chatModels: TableSenders;
  chatSettings: TableChatSettings;
  // Audio to Text
  audioToTextMessages: TableMessages;
  audioToTextModels: TableSenders;
  audioToTextSettings: TableAudioToTextSettings;
  // Chatbot
  chatbotMessages: TableMessages;
  chatbotSessions: TableSenders;
};

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

export let chatStorage: StorageChatIndexDB | null = null;
export let audioToTextStorage: StorageAudioToTextIndexDB | null = null;

aISettings.open().then(() => {
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
});
