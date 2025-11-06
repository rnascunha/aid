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

import { ProviderAuthType, ProviderProps } from "./types";

export const providers: ProviderProps[] = [
  {
    name: "Open AI",
    id: "openai",
    provider: "openai",
    logo: openai,
    url: "https://platform.openai.com/",
    type: ["chat", "audioToText"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "Anthropic",
    id: "anthropic",
    provider: "anthropic",
    logo: anthropic,
    url: "https://www.anthropic.com/",
    type: ["chat"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "Cerebras",
    id: "cerebras",
    provider: "cerebras",
    logo: cerebras,
    url: "https://www.cerebras.ai/",
    type: ["chat"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "Cohere",
    id: "cohere",
    provider: "cohere",
    logo: cohere,
    url: "https://cohere.com/",
    type: ["chat"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "Deepseek",
    id: "deepseek",
    provider: "deepseek",
    logo: deepseek,
    url: "https://www.deepseek.com/en",
    type: ["chat"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "Groq",
    id: "groq",
    provider: "groq",
    logo: groq,
    url: "https://groq.com/",
    type: ["chat"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "IBM Watson",
    id: "watsonx",
    provider: "watsonx",
    logo: watson,
    url: "https://www.ibm.com/products/watsonx",
    type: ["chat"],
    auth: {
      type: ProviderAuthType.AUTH_IBM_WATSONX,
      key: "",
      projectId: "",
      serviceURL: "",
    },
  },
  {
    name: "Inception Labs",
    id: "inception-labs",
    provider: "openai",
    logo: inception,
    url: "https://www.inceptionlabs.ai/",
    type: ["chat"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "Mistral AI",
    id: "mistral",
    provider: "mistral",
    logo: mistral,
    url: "https://mistral.ai/",
    type: ["chat"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "Nebius",
    id: "nebius",
    provider: "nebius",
    logo: nebius,
    url: "https://nebius.com/",
    type: ["chat"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "Sambanova",
    id: "sambanova",
    provider: "sambanova",
    logo: sambanova,
    url: "https://sambanova.ai/",
    type: ["chat"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "Vertex AI",
    id: "google",
    provider: "google",
    logo: vertex,
    url: "https://cloud.google.com/vertex-ai",
    type: ["chat", "audioToText"],
    auth: {
      type: ProviderAuthType.AUTH_GOOGLE,
      projectId: "",
      region: "",
      appCredentials: "",
    },
  },
  {
    name: "Xai",
    id: "xai",
    provider: "xai",
    logo: xai,
    url: "https://x.ai/",
    type: ["chat"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "Hugging Face",
    id: "huggingface",
    logo: huggingface,
    provider: "huggingface",
    url: "https://huggingface.co/",
    type: ["audioToText"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
  {
    name: "Deepgram",
    id: "deepgram",
    provider: "deepgram",
    logo: deepgram,
    url: "https://deepgram.com/",
    type: ["audioToText"],
    auth: {
      type: ProviderAuthType.AUTH_API_KEY,
      key: "",
    },
  },
] as const;

export const providerMap = providers.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<ProviderProps["id"], ProviderProps>);
