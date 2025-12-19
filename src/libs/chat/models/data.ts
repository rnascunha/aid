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
import aws from "@/images/ai/aws.png";
import azure from "@/images/ai/azure.svg";
import ollama from "@/images/ai/ollama.svg";
import lmstudio from "@/images/ai/lm-studio.svg";

import { ToolsProps } from "../types";
import {
  ProviderAuthType,
  ProviderBaseProps,
  ProviderConfigType,
  ProviderProps,
} from "@/libs/chat/models/types";

export const providersBase: ProviderBaseProps[] = [
  {
    name: "Open AI",
    id: "openai",
    provider: "openai",
    logo: openai,
    url: "https://platform.openai.com/",
    type: ["chat", "audioToText"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Anthropic",
    id: "anthropic",
    provider: "anthropic",
    logo: anthropic,
    url: "https://www.anthropic.com/",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Cerebras",
    id: "cerebras",
    provider: "cerebras",
    logo: cerebras,
    url: "https://www.cerebras.ai/",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Cohere",
    id: "cohere",
    provider: "cohere",
    logo: cohere,
    url: "https://cohere.com/",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Deepseek",
    id: "deepseek",
    provider: "deepseek",
    logo: deepseek,
    url: "https://www.deepseek.com/en",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Groq",
    id: "groq",
    provider: "groq",
    logo: groq,
    url: "https://groq.com/",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "IBM Watson",
    id: "watsonx",
    provider: "watsonx",
    logo: watson,
    url: "https://www.ibm.com/products/watsonx",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_IBM_WATSONX,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Inception Labs",
    id: "inception-labs",
    provider: "openai",
    logo: inception,
    url: "https://www.inceptionlabs.ai/",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Mistral AI",
    id: "mistral",
    provider: "mistral",
    logo: mistral,
    url: "https://mistral.ai/",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Nebius",
    id: "nebius",
    provider: "nebius",
    logo: nebius,
    url: "https://nebius.com/",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Sambanova",
    id: "sambanova",
    provider: "sambanova",
    logo: sambanova,
    url: "https://sambanova.ai/",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Vertex AI",
    id: "google",
    provider: "google",
    logo: vertex,
    url: "https://cloud.google.com/vertex-ai",
    type: ["chat", "audioToText"],
    authType: ProviderAuthType.AUTH_GOOGLE,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Xai",
    id: "xai",
    provider: "xai",
    logo: xai,
    url: "https://x.ai/",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Hugging Face",
    id: "huggingface",
    logo: huggingface,
    provider: "huggingface",
    url: "https://huggingface.co/",
    type: ["audioToText"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Deepgram",
    id: "deepgram",
    provider: "deepgram",
    logo: deepgram,
    url: "https://deepgram.com/",
    type: ["audioToText"],
    authType: ProviderAuthType.AUTH_API_KEY,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "AWS",
    id: "aws",
    provider: "aws",
    logo: aws,
    url: "https://console.aws.amazon.com/bedrock/home/",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_AWS,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Azure",
    id: "azure",
    provider: "azure",
    logo: azure,
    url: "https://portal.azure.com/",
    type: ["chat"],
    authType: ProviderAuthType.AUTH_AZURE,
    configType: ProviderConfigType.CONFIG_NONE,
  },
  {
    name: "Ollama",
    id: "ollama",
    provider: "ollama",
    logo: ollama,
    url: "https://ollama.com/",
    type: ["chat"],
    authType: ProviderAuthType.NONE,
    configType: ProviderConfigType.CONFIG_API_URL,
  },
  {
    name: "LM Studio",
    id: "lmstudio",
    provider: "lmstudio",
    logo: lmstudio,
    url: "https://lmstudio.ai/",
    type: ["chat"],
    authType: ProviderAuthType.NONE,
    configType: ProviderConfigType.CONFIG_API_URL,
  },
] as const;

export const providerAuthTemplate = {
  [ProviderAuthType.NONE]: undefined,
  [ProviderAuthType.AUTH_API_KEY]: {
    key: "",
  },
  [ProviderAuthType.AUTH_AWS]: {
    access_key: "",
    secret_key: "",
    region: "",
  },
  [ProviderAuthType.AUTH_AZURE]: {
    key: "",
    base_url: "",
    api_version: "",
  },
  [ProviderAuthType.AUTH_GOOGLE]: {
    project_id: "",
    region: "",
    application_credentials: "",
  },
  [ProviderAuthType.AUTH_IBM_WATSONX]: {
    key: "",
    project_id: "",
    service_url: "",
  },
};

export const providerConfigTemplate = {
  [ProviderConfigType.CONFIG_NONE]: undefined,
  [ProviderConfigType.CONFIG_API_URL]: {
    api_url: "",
    timeout: 300,
  },
};

export const providerBaseMap = providersBase.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<ProviderProps["id"], ProviderBaseProps>);

export const initTools: ToolsProps = {
  ip: "",
  geoLocationApiKey: "",
};
