import { ModelProps } from "@/libs/chat/models/types";
import { ChatMessagesProps, ToolsProps } from "@/libs/chat/types";

export interface GeneralSettings {
  temperature: number;
}

export interface ContextSettings {
  systemPrompt: string;
  maxContextMessages: number;
  maxElapsedTimeMessages: number;
}

export interface ToolNode {
  id: string;
  label: string;
  validade?: (
    id: string,
    toolInfo: ToolsProps,
    tools: string[],
  ) => { allowed: boolean; error: string | undefined };
}

export interface ToolsSettings {
  tools: string[];
  maxTurns: number;
}

export interface ChatSettings {
  general: GeneralSettings;
  context: ContextSettings;
  tools: ToolsSettings;
}

export interface ChatData {
  chats: ChatMessagesProps;
  models: ModelProps[];
  settings: ChatSettings;
}
