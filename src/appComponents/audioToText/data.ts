import { ChatMessagesProps, ModelProps } from "@/components/chat/types";

export const models: ModelProps[] = [
  {
    name: "Open AI Whisper 1",
    id: "openai:0",
    providerId: "openai",
    model: "whisper-1",
  },
  {
    name: "Deepgram",
    id: "deepgram:1",
    providerId: "deepgram",
    model: "nova-2",
  },
  {
    name: "Deepgram",
    id: "deepgram:2",
    providerId: "deepgram",
    model: "nova",
  },
  {
    name: "Deepgram",
    id: "deepgram:3",
    providerId: "deepgram",
    model: "enhanced",
  },
  {
    name: "Deepgram",
    id: "deepgram:4",
    providerId: "deepgram",
    model: "base",
  },
  {
    name: "Google",
    id: "google:1",
    providerId: "google",
    model: "default",
  },
  {
    name: "Google",
    id: "google:2",
    providerId: "google",
    model: "latest_long",
  },
  {
    name: "Google",
    id: "google:3",
    providerId: "google",
    model: "latest_short",
  },
  {
    name: "Hugging Face",
    id: "huggingface:0",
    providerId: "huggingface",
    model: "openai/whisper-large-v3",
  },
  {
    name: "Hugging Face",
    id: "huggingface:1",
    providerId: "huggingface",
    model: "openai/whisper-tiny",
  },
  {
    name: "Hugging Face",
    id: "huggingface:2",
    providerId: "huggingface",
    model: "facebook/wav2vec2-base-960h",
  },
  {
    name: "Hugging Face",
    id: "huggingface:3",
    providerId: "huggingface",
    model: "facebook/wav2vec2-large-xlsr-53",
  },
];

export const chats: ChatMessagesProps = models.reduce((acc, u) => {
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

export const initAudioOptions = {
  language: "en",
  temperature: 0.75,
  prompt: "",
};
