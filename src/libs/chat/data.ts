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

import { ProviderProps } from "./types";

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