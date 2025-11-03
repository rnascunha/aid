import {
  ChatMessagesProps,
  ModelProps,
  ProviderProps,
} from "@/components/chat/types";

import { ChatSettings, Tool } from "./types";

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
import deepgram from "@/images/ai/deepgram.jpeg";
import huggingface from "@/images/ai/hugging-face.svg";

export const providers: ProviderProps[] = [
  {
    name: "Open AI",
    id: "openai",
    provider: "openai",
    logo: openai,
  },
  {
    name: "Anthropic",
    id: "anthropic",
    provider: "anthropic",
    logo: anthropic,
  },
  {
    name: "Cerebras",
    id: "cerebras",
    provider: "cerebras",
    logo: cerebras,
  },
  {
    name: "Cohere",
    id: "cohere",
    provider: "cohere",
    logo: cohere,
  },
  {
    name: "Deepseek",
    id: "deepseek",
    provider: "deepseek",
    logo: deepseek,
  },
  {
    name: "Groq",
    id: "groq",
    provider: "groq",
    logo: groq,
  },
  {
    name: "IBM Watson",
    id: "watsonx",
    provider: "watsonx",
    logo: watson,
  },
  {
    name: "Inception Labs",
    id: "inception-labs",
    provider: "openai",
    logo: inception,
  },
  {
    name: "Mistral AI",
    id: "mistral",
    provider: "mistral",
    logo: mistral,
  },
  {
    name: "Nebius",
    id: "nebius",
    provider: "nebius",
    logo: nebius,
  },
  {
    name: "Sambanova",
    id: "sambanova",
    provider: "sambanova",
    logo: sambanova,
  },
  {
    name: "Vertex AI",
    id: "google",
    provider: "google",
    logo: vertex,
  },
  {
    name: "Xai",
    id: "xai",
    provider: "xai",
    logo: xai,
  },
  {
    name: "Hugging Face",
    id: "huggingface",
    logo: huggingface,
    provider: "huggingface",
  },
  {
    name: "Deepgram",
    id: "deepgram",
    provider: "deepgram",
    logo: deepgram,
  },
];

export const providerMap = providers.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<ProviderProps["id"], ProviderProps>);

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

export const toolsList: Tool[] = [
  { id: "get_current_datetime", label: "Current date/time" },
];

export const toolsMap = toolsList.reduce((acc, t) => {
  acc[t.id] = t;
  return acc;
}, {} as Record<string, Tool>);

export const defaultSettings: ChatSettings = {
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
