import { BaseSender } from "@/libs/chat/types";

export interface SessionType extends BaseSender {
  state: Record<string, unknown>;
}
