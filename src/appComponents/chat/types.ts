import { ModelProps } from "@/libs/chat/models/types";
import { ChatMessagesProps, ToolsProps } from "@/libs/chat/types";
import z from "zod";

const GeneralSettings = z.object({
  temperature: z.number(),
});
export type GeneralSettings = z.infer<typeof GeneralSettings>;

const ContextSettings = z.object({
  systemPrompt: z.string(),
  maxContextMessages: z.number(),
  maxElapsedTimeMessages: z.number(),
});
export type ContextSettings = z.infer<typeof ContextSettings>;

export interface ToolNode {
  id: string;
  label: string;
  validade?: (
    id: string,
    toolInfo: ToolsProps,
    tools: string[],
  ) => { allowed: boolean; error: string | undefined };
}

const ToolsSettings = z.object({
  tools: z.array(z.string()),
  maxTurns: z.number(),
});
export type ToolsSettings = z.infer<typeof ToolsSettings>;

export const ChatSettings = z.object({
  general: GeneralSettings,
  context: ContextSettings,
  tools: ToolsSettings,
});
export type ChatSettings = z.infer<typeof ChatSettings>;

export interface ChatData {
  chats: ChatMessagesProps;
  models: ModelProps[];
  settings: ChatSettings;
}
