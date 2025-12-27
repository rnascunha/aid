import {
  MessageContentStatus,
  PartInlineData,
  TypeMessage,
} from "@/libs/chat/types";

export interface InputOutput {
  text: string;
  files: PartInlineData[];
}

export type onSubmitInputType = (
  value: InputOutput | MessageContentStatus,
  type: TypeMessage
) => Promise<void>;

