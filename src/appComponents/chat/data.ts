import { ChatProps, UserProps } from "./types";

import openai from "@/images/ai/openai.png";
import anthropic from "@/images/ai/anthropic.svg";
import cerebras from "@/images/ai/cerebras.svg";
import cohere from "@/images/ai/cohere.svg";
import deepgram from "@/images/ai/deepgram.jpeg";
import deepseek from "@/images/ai/deepseek-ai.svg";
import groq from "@/images/ai/groq.svg";
import watson from "@/images/ai/ibm-watson.png";
import inception from "@/images/ai/inception_labs.jpeg";
import mistral from "@/images/ai/mistral-ai.svg";
import nebius from "@/images/ai/nebius.svg";
import sambanova from "@/images/ai/sambanova.svg";
import vertex from "@/images/ai/vertex-ai.svg";
import xai from "@/images/ai/xai.svg";

export const users: UserProps[] = [
  {
    name: "Open AI",
    id: "openai",
    logo: openai,
    online: true,
  },
  {
    name: "Anthropic",
    id: "anthropic",
    logo: anthropic,
    online: true,
  },
  {
    name: "Cerebras",
    id: "cerebras",
    logo: cerebras,
    online: true,
  },
  {
    name: "Cohere",
    id: "cohere",
    logo: cohere,
    online: true,
  },
  {
    name: "Deepgram",
    id: "deepgram",
    logo: deepgram,
    online: true,
  },
  {
    name: "Deepseek",
    id: "deepseek",
    logo: deepseek,
    online: true,
  },
  {
    name: "Groq",
    id: "groq",
    logo: groq,
    online: true,
  },
  {
    name: "IBM Watson",
    id: "ibm-watson",
    logo: watson,
    online: true,
  },
  {
    name: "Inception Labs",
    id: "inception-labs",
    logo: inception,
    online: true,
  },
  {
    name: "Mistral AI",
    id: "mistral",
    logo: mistral,
    online: true,
  },
  {
    name: "Nebius",
    id: "nebius",
    logo: nebius,
    online: true,
  },
  {
    name: "Sambanova",
    id: "sambanova",
    logo: sambanova,
    online: true,
  },
  {
    name: "Vertex AI",
    id: "vertex",
    logo: vertex,
    online: true,
  },
  {
    name: "Xai",
    id: "xai",
    logo: xai,
    online: true,
  },
] as const;

export const chats: ChatProps = users.reduce((acc, u) => {
  acc[u.id] = [];
  return acc;
}, {} as ChatProps);
