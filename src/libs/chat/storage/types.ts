import { ChatSettings } from "@/appComponents/chat/types";
import { ModelProps, ProviderProps } from "../models/types";
import { BaseSender, MessageProps, ToolsProps } from "../types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { z } from "zod";

// export type ToolsDB = Omit<ToolsProps, "ip">;
const ToolsDB = ToolsProps.omit({ ip: true });
export type ToolsDB = z.infer<typeof ToolsDB>;

const DBExportFormatV1 = z.object({
  version: z.literal(1),
  // General
  providers: z.array(ProviderProps),
  tools: ToolsDB.optional(),
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
