import {
  MessageContentStatus,
  PartInlineData,
  PartText,
  TypeMessage,
} from "@/libs/chat/types";

export interface InputOutput {
  text: PartText;
  files: PartInlineData[];
}

export type onSubmitInputType = (
  value: InputOutput | MessageContentStatus,
  type: TypeMessage
) => Promise<void>;

