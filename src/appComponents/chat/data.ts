import { ModelProps } from "@/libs/chat/models/types";
import { ChatSettings, ToolNode } from "./types";
import { ChatMessagesProps } from "@/libs/chat/types";

export const models: ModelProps[] = [
  {
    id: "openai:0",
    providerId: "openai",
    name: "Open AI GPT-4o",
    model: "gpt-4o",
  },
  {
    id: "anthropic:0",
    name: "Anthropic Claude 3.5",
    providerId: "anthropic",
    model: "claude-3-5-sonnet-20240620",
  },
  {
    id: "cerberas:0",
    name: "Cerebras LLama 3.1",
    providerId: "cerebras",
    model: "llama3.1-8b",
  },
  {
    id: "cohere:0",
    name: "Cohere Command",
    providerId: "cohere",
    model: "command-r-plus-08-2024",
  },
  {
    id: "deepseek:0",
    name: "Deepseek Reasoner",
    providerId: "deepseek",
    model: "deepseek-reasoner",
  },
  {
    id: "groq:0",
    name: "Groq Llama 4",
    providerId: "groq",
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
  },
  {
    id: "watsonx:0",
    name: "IBM Watson GPT OSS",
    providerId: "watsonx",
    model: "openai/gpt-oss-120b",
  },
  {
    id: "inception-labs:0",
    name: "Inception Labs Mercury",
    providerId: "inception-labs",
    model: "mercury",
  },
  {
    id: "mistral:0",
    name: "Mistral AI Large",
    providerId: "mistral",
    model: "mistral-large-latest",
  },
  {
    id: "nebius:0",
    name: "Nebius",
    providerId: "nebius",
    model: "meta-llama/Llama-3.3-70B-Instruct",
  },
  {
    id: "sambanova:0",
    name: "Sambanova Llama 4",
    providerId: "sambanova",
    model: "Llama-4-Maverick-17B-128E-Instruct",
  },
  {
    id: "google:0",
    name: "Gemini 1.5",
    providerId: "google",
    model: "gemini-1.5-pro-001",
  },
  {
    id: "xai:0",
    name: "Xai Grok 3",
    providerId: "xai",
    model: "grok-3-latest",
  },
];

export const chats: ChatMessagesProps = models.reduce((acc, u) => {
  acc[u.id] = [];
  return acc;
}, {} as ChatMessagesProps);

export const toolsList: ToolNode[] = [
  { id: "get_current_datetime", label: "Current date/time" },
  {
    id: "get_user_ip",
    label: "Get user IP",
    validade: (id, toolInfo) => {
      const allowed = toolInfo.ip !== "";
      return { allowed, error: allowed ? undefined : "Error getting IP" };
    },
  },
  {
    id: "get_user_location",
    label: "Get location",
    validade: (id, toolInfo, tools) => {
      const requiredTools = tools.includes("get_user_ip");
      const allowed =
        toolInfo.ip !== "" &&
        toolInfo.geoLocationApiKey !== "" &&
        requiredTools;
      return {
        allowed,
        error: allowed
          ? undefined
          : !requiredTools
            ? "Must allow IP tool"
            : toolInfo.geoLocationApiKey === ""
              ? "Must configure Geolocation tool"
              : "Error getting IP",
      };
    },
  },
] as const;

export const toolsMap = toolsList.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<string, ToolNode>,
);

const defaultSettings: ChatSettings = {
  general: { temperature: 0.75 },
  context: {
    systemPrompt: "You are a helpful assistant.",
    maxContextMessages: 10,
    maxElapsedTimeMessages: 15 * 60 * 1000,
  },
  tools: {
    maxTurns: 2,
    tools: ["get_current_datetime"],
  },
};

export const defaultChatData = {
  chats: {},
  models: [],
  settings: defaultSettings,
};
