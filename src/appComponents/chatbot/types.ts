import { MessageProps } from "@/libs/chat/types";

export interface SessionType {
  id: string;
  name: string;
}

export type MessageSessionProps = MessageProps<SessionType>;
