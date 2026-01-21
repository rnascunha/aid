import { ModelProps } from "@/libs/chat/models/types";
import { ChatMessagesProps } from "@/libs/chat/types";

export interface AudioToTextSettings {
  language: string;
  temperature: number;
  prompt: string;
}

export interface AudioToTextData {
  chats: ChatMessagesProps;
  models: ModelProps[];
  settings: AudioToTextSettings;
}
