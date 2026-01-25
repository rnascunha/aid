import { ModelProps } from "@/libs/chat/models/types";
import { ChatMessagesProps } from "@/libs/chat/types";
import z from "zod";

export const AudioToTextSettings = z.object({
  language: z.string(),
  temperature: z.number(),
  prompt: z.string(),
});
export type AudioToTextSettings = z.infer<typeof AudioToTextSettings>;

export interface AudioToTextData {
  chats: ChatMessagesProps;
  models: ModelProps[];
  settings: AudioToTextSettings;
}
