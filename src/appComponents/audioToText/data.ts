import { ChatMessagesProps } from "@/libs/chat/types";
import { AudioToTextData } from "./types";

export const audioToTextProviderModel: Record<string, string[]> = {
  openai: ["whisper-1"],
  deepgram: ["nova", "nova-2", "enhanced", "base"],
  google: ["default", "latest_long", "latest_short"],
  huggingface: [
    "openai/whisper-large-v3",
    "openai/whisper-tiny",
    "facebook/wav2vec2-base-960h",
    "facebook/wav2vec2-large-xlsr-53",
  ],
} as const;

export const chats: ChatMessagesProps = {};

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

const defaultAudioSettings = {
  language: "en",
  temperature: 0.75,
  prompt: "",
};

export const defaultAudioToTextData: AudioToTextData = {
  chats: {},
  models: [],
  settings: defaultAudioSettings,
};
