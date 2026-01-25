import { ChatSettings } from "@/appComponents/chat/types";
import { ModelProps, ProviderProps } from "../models/types";
import { BaseSender, MessageProps, ToolsProps } from "../types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { z } from "zod";

const ToolsDB = ToolsProps.omit({ ip: true });
export type ToolsDB = z.infer<typeof ToolsDB>;

export const DBExportFormatV1 = z.object({
  version: z.literal(1),
  // General
  providers: z.array(ProviderProps),
  tools: z.nullable(ToolsDB.optional()),
  // Chat
  chatMessages: z.array(MessageProps),
  chatModels: z.array(ModelProps),
  chatSettings: ChatSettings.optional(),
  // AudioToText
  audioToTextMessages: z.array(MessageProps),
  audioToTextModels: z.array(ModelProps),
  audioToTextSettings: AudioToTextSettings.optional(),
  // Chatbot
  chatbotMessages: z.array(MessageProps),
  chatbotSenders: z.array(BaseSender),
});
export type DBExportFormatV1 = z.infer<typeof DBExportFormatV1>;

export type DBExpotFormat = DBExportFormatV1;
