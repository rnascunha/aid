import { ChatMessagesProps, ProviderProps } from "@/components/chat/types";

import openai from "@/images/ai/openai.png";
import vertex from "@/images/ai/vertex-ai.svg";
import deepgram from "@/images/ai/deepgram.jpeg";
import huggingface from "@/images/ai/hugging-face.png";

export const providers: ProviderProps[] = [
  {
    name: "Open AI",
    id: "openai",
    provider: "openai",
    model: "whisper-1",
    logo: openai,
    online: true,
  },
  {
    name: "Deepgram",
    id: "deepgram",
    provider: "deepgram",
    model: "nova-2",
    logo: deepgram,
    online: true,
  },
  {
    name: "Deepgram",
    id: "deepgram2",
    provider: "deepgram",
    model: "nova",
    logo: deepgram,
    online: true,
  },
  {
    name: "Deepgram",
    id: "deepgram3",
    provider: "deepgram",
    model: "enhanced",
    logo: deepgram,
    online: true,
  },
  {
    name: "Deepgram",
    id: "deepgram4",
    provider: "deepgram",
    model: "base",
    logo: deepgram,
    online: true,
  },
  {
    name: "Google",
    id: "google",
    provider: "google",
    model: "default",
    logo: vertex,
    online: true,
  },
  {
    name: "Google",
    id: "google2",
    provider: "google",
    model: "latest_long",
    logo: vertex,
    online: true,
  },
  {
    name: "Google",
    id: "google3",
    provider: "google",
    model: "latest_short",
    logo: vertex,
    online: true,
  },
  {
    name: "Hugging Face",
    id: "huggingface",
    provider: "huggingface",
    model: "openai/whisper-large-v3",
    logo: huggingface,
    online: true,
  },
  {
    name: "Hugging Face",
    id: "huggingface1",
    provider: "huggingface",
    model: "openai/whisper-tiny",
    logo: huggingface,
    online: true,
  },
  {
    name: "Hugging Face",
    id: "huggingface2",
    provider: "huggingface",
    model: "facebook/wav2vec2-base-960h",
    logo: huggingface,
    online: true,
  },
  {
    name: "Hugging Face",
    id: "huggingface3",
    provider: "huggingface",
    model: "facebook/wav2vec2-large-xlsr-53",
    logo: huggingface,
    online: true,
  },
] as const;

export const chats: ChatMessagesProps = providers.reduce((acc, u) => {
  acc[u.id] = [];
  return acc;
}, {} as ChatMessagesProps);

export interface AudioToTextLanguage {
  value: string;
  label: string;
  flagCode?: string;
}

export const audiToTextLanguageOptions: AudioToTextLanguage[] = [
  { value: "en", label: "English", flagCode: "us" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese", flagCode: "br" },
  { value: "ja", label: "Japan", flagCode: "jp" },
  { value: "ko", label: "Korean", flagCode: "kr" },
  { value: "zh", label: "Chinese", flagCode: "cn" },
  { value: "ar", label: "Arabic", flagCode: "sa" },
  { value: "hi", label: "Hindi", flagCode: "in" },
  { value: "ru", label: "Russian" },
  { value: "nl", label: "Nederlands" },
  { value: "pl", label: "Polish" },
  { value: "sv", label: "Swedish", flagCode: "se" },
  { value: "da", label: "Danish", flagCode: "dk" },
  { value: "no", label: "Norwegian" },
  { value: "fi", label: "Finnish" },
  { value: "tr", label: "Turkish" },
  { value: "th", label: "Thai" },
  { value: "vi", label: "Vietnamese", flagCode: "vn" },
];

export interface AudioToTextOptions {
  language: (typeof audiToTextLanguageOptions)[number]["value"];
  temperature: number;
  prompt: string;
}

export const initAudioOptions = { language: "en", temperature: 0.75, prompt: "" }
