import {
  MessageContentStatus,
  Part,
  ToolsProps,
  TypeMessage,
} from "@/libs/chat/types";
import { GeneralSettings, ToolsSettings } from "@/appComponents/chat/types";

/**
 * From:
 * https://github.com/andrewyng/aisuite/blob/main/aisuite-js/src/types/tools.ts
 */
export interface Tool {
  type: "function";
  function: FunctionDefinition;
}

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

export type ToolChoice =
  | "auto"
  | "none"
  | { type: "function"; function: { name: string } };

/**
 * From:
 * https://github.com/andrewyng/aisuite/blob/main/aisuite-js/src/types/chat.ts
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  name?: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
}

export interface ChatCompletionRequest {
  model: string; // "provider:model" format
  messages: ChatMessage[];
  tools?: Tool[];
  tool_choice?: ToolChoice;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  stream?: boolean;
  user?: string;
}

export interface IntermerdiateResponses {
  choices: ChatChoice[];
  usage: Usage;
}

export interface ChatCompletionResponse {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: ChatChoice[];
  usage: Usage;
  system_fingerprint?: string;
  // Added by me
  intermediate_responses: IntermerdiateResponses[];
}

export interface ChatCompletionChunk {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: "assistant";
      content?: string;
      tool_calls?: ToolCall[];
    };
    finish_reason?: string;
  }>;
  usage?: Usage;
}

export interface ChatChoice {
  index: number;
  message: ChatMessage;
  finish_reason: string;
  // Added by me
  intermediate_messages?: ChatMessage[];
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// Add by me
export interface ChatErrorMessage {
  error: string;
  detail: string;
}

export type ChatSettingsPython = GeneralSettings & ToolsSettings;
export interface ChatInfo {
  tool: ToolsProps;
}

export interface ChatResponse {
  type: TypeMessage;
  content: MessageContentStatus | Part[];
  raw: ChatCompletionResponse | ChatErrorMessage | string;
}
