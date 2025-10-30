import { ChatMessagesProps, ProviderProps } from "@/components/chat/types";

import openai from "@/images/ai/openai.png";
import anthropic from "@/images/ai/anthropic.svg";
import cerebras from "@/images/ai/cerebras.svg";
import cohere from "@/images/ai/cohere.svg";
import deepseek from "@/images/ai/deepseek-ai.svg";
import groq from "@/images/ai/groq.svg";
import watson from "@/images/ai/ibm-watson.png";
import inception from "@/images/ai/inception_labs.jpeg";
import mistral from "@/images/ai/mistral-ai.svg";
import nebius from "@/images/ai/nebius.svg";
import sambanova from "@/images/ai/sambanova.svg";
import vertex from "@/images/ai/vertex-ai.svg";
import xai from "@/images/ai/xai.svg";
import { ChatSettings, Tool } from "./types";

export const providers: ProviderProps[] = [
  {
    name: "Open AI",
    id: "openai",
    provider: "openai",
    model: "gpt-4o",
    logo: openai,
    online: true,
  },
  {
    name: "Anthropic",
    id: "anthropic",
    provider: "anthropic",
    model: "claude-3-5-sonnet-20240620",
    logo: anthropic,
    online: true,
  },
  {
    name: "Cerebras",
    id: "cerebras",
    provider: "cerebras",
    model: "llama3.1-8b",
    logo: cerebras,
    online: true,
  },
  {
    name: "Cohere",
    id: "cohere",
    provider: "cohere",
    model: "command-r-plus-08-2024",
    logo: cohere,
    online: true,
  },
  {
    name: "Deepseek",
    id: "deepseek",
    provider: "deepseek",
    model: "deepseek-reasoner",
    logo: deepseek,
    online: true,
  },
  {
    name: "Groq",
    id: "groq",
    provider: "groq",
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    logo: groq,
    online: true,
  },
  {
    name: "IBM Watson",
    id: "watsonx",
    provider: "watsonx",
    model: "openai/gpt-oss-120b",
    logo: watson,
    online: true,
  },
  {
    name: "Inception Labs",
    id: "inception-labs",
    provider: "openai",
    model: "mercury",
    logo: inception,
    online: true,
  },
  {
    name: "Mistral AI",
    id: "mistral",
    provider: "mistral",
    model: "mistral-large-latest",
    logo: mistral,
    online: true,
  },
  {
    name: "Nebius",
    id: "nebius",
    provider: "nebius",
    model: "meta-llama/Llama-3.3-70B-Instruct",
    logo: nebius,
    online: true,
  },
  {
    name: "Sambanova",
    id: "sambanova",
    provider: "sambanova",
    model: "Llama-4-Maverick-17B-128E-Instruct",
    logo: sambanova,
    online: true,
  },
  {
    name: "Vertex AI",
    id: "google",
    provider: "google",
    model: "gemini-1.5-pro-001",
    logo: vertex,
    online: true,
  },
  {
    name: "Xai",
    id: "xai",
    provider: "xai",
    model: "grok-3-latest",
    logo: xai,
    online: true,
  },
] as const;

// export const providerMap = new Map(providers.map((p) => [p.id, p]));

export const chats: ChatMessagesProps = providers.reduce((acc, u) => {
  acc[u.id] = [];
  return acc;
}, {} as ChatMessagesProps);

export const toolsList: Tool[] = [
  { id: "get_current_datetime", label: "Current date/time" },
];
export const toolsMap = toolsList.reduce((acc, t) => {
  acc[t.id] = t;
  return acc;
}, {} as Record<string, Tool>);

export const settings: ChatSettings = {
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
