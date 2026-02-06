import Dexie, { Table } from "dexie";
import { BaseSender, MessageProps } from "../../types";
import { ChatSettings } from "@/appComponents/chat/types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { ProviderProps } from "../../models/types";
import { ToolsDB } from "../types";

export type TableProviders = Table<ProviderProps, string>;
export type TableTools = Table<ToolsDB, string>;

export type TableMessages = Table<MessageProps, [string, string, number]>;
export type TableSenders = Table<BaseSender, string>;

// Chat
export type TableChatSettings = Table<ChatSettings, string, ChatSettings>;

// AudioToText
export type TableAudioToTextSettings = Table<
  AudioToTextSettings,
  string,
  AudioToTextSettings
>;

export type StorageStoreType = Dexie & {
  // General
  providers: TableProviders;
  tools: TableTools;
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
  // Agent Traveler
  agentTravelerMessages: TableMessages;
  agentTravelerSessions: TableSenders;
};
