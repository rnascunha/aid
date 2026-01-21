import { Table } from "dexie";
import { BaseSender, MessageProps, ToolsProps } from "../../types";
import { ChatSettings } from "@/appComponents/chat/types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";

export type ToolsDB = Omit<ToolsProps, "ip">;

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
