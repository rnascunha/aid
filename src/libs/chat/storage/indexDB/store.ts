import Dexie, { Table } from "dexie";
import { TableMessages, TableSenders, ToolsDB } from "./types";
import { ChatSettings } from "@/appComponents/chat/types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { ProviderProps } from "@/libs/chat/models/types";

export const aISettings = new Dexie("AISettings") as Dexie & {
  // General
  providers: Table<ProviderProps, string>;
  tools: Table<ToolsDB, string>;
  // Chat
  chatMessages: TableMessages;
  chatModels: TableSenders;
  chatSettings: Table<ChatSettings, string>;
  // Audio to Text
  audioToTextMessages: TableMessages;
  audioToTextModels: TableSenders;
  audioToTextSettings: Table<AudioToTextSettings, string>;
  // Chatbot
  chatbotMessages: TableMessages;
  chatbotSessions: TableSenders;
};

aISettings.version(1).stores({
  // General
  providers: "id",
  tools: "",
  // Chat
  chatMessages: "[id+senderId], senderId",
  chatModels: "id, providerId",
  chatSettings: "",
  // Audio to Text
  audioToTextMessages: "[id+senderId], senderId",
  audioToTextModels: "id, providerId",
  audioToTextSettings: "",
  // Chatbot
  chatbotMessages: "[id+senderId], senderId",
  chatbotSessions: "id",
});

aISettings.open();
