import { ChatSettings } from "@/appComponents/chat/types";
import { ModelProps, ProviderProps } from "../models/types";
import { BaseSender, MessageProps, ToolsProps } from "../types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";

export type ToolsDB = Omit<ToolsProps, "ip">;

export interface DBExportFormatV1 {
  version: 1;
  // General
  providers: ProviderProps[];
  tools: ToolsDB | undefined;
  // Chat
  chatMessages: MessageProps[];
  chatModels: ModelProps[];
  chatSettings: ChatSettings | undefined;
  // AudioToText
  audioToTextMessages: MessageProps[];
  audioToTextModels: ModelProps[];
  audioToTextSettings: AudioToTextSettings | undefined;
  // Chatbot
  chatbotMessages: MessageProps[];
  chatbotSenders: BaseSender[];
}

export type DBExpotFormat = DBExportFormatV1;
