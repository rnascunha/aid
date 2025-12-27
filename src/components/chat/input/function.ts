import { Part, PartType } from "@/libs/chat/types";
import { InputOutput } from "./types";

export function makeInputParts(data: InputOutput) {
  const parts: Part[] = data.files.map((f) => ({ [PartType.INLINE_DATA]: f }));
  if (data.text) parts.push({ [PartType.TEXT]: data.text });
  return parts;
}
