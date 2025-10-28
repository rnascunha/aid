import { Dispatch, SetStateAction } from "react";
import {
  ChatMessagesProps,
  ChatSuccessMessage,
  MessageContext,
  MessageProps,
  MessageRoleType,
  ProviderProps,
} from "./types";
import { chatRequest } from "@/actions/ai/chat";

export function sortedProviders(chats: ChatMessagesProps) {
  const list = Object.keys(chats) as (keyof ChatMessagesProps)[];
  list.sort((c1, c2) => {
    const m1 = chats[c1].at(-1);
    const m2 = chats[c2].at(-1);
    if (!m1 && !m2) return -1;
    if (m1 && m2) return m1.timestamp < m2.timestamp ? 1 : -1;
    if (m1) return -1;
    return 1;
  });
  return list;
}

function contextMessagesFilter(
  messages: MessageProps[],
  {
    max = 10,
    elapsedTimeMs = Number.MAX_SAFE_INTEGER,
  }: { max?: number; elapsedTimeMs?: number }
) {
  const now = Date.now();
  const m = messages
    .filter((m) => "success" in m.content)
    .slice(-Math.max(max, 0))
    .filter((msg) => now - msg.timestamp <= elapsedTimeMs);
  return m;
}

function formatContextMessages(messages: MessageProps[]) {
  return messages
    .filter((m) => "success" in m.content)
    .map((m) => ({
      role: m.id.endsWith("r") ? "assistant" : ("user" as MessageRoleType),
      content: (m.content as ChatSuccessMessage).response,
    }));
}

export function contextMessages(
  messages: MessageProps[],
  {
    max = 10,
    elapsedTimeMs = Number.MAX_SAFE_INTEGER,
  }: { max?: number; elapsedTimeMs?: number }
) {
  return formatContextMessages(
    contextMessagesFilter(messages, { max, elapsedTimeMs })
  ) as MessageContext[];
}

export function messageSubmit(
  message: string,
  newId: number,
  provider: ProviderProps,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>
) {
  const newIdString = newId.toString();
  setChats((prev) => ({
    ...prev,
    [provider.id]: [
      ...prev[provider.id],
      {
        id: newIdString,
        sender: "You",
        content: { response: message, success: true },
        timestamp: Date.now(),
      },
    ],
  }));
}

export async function attachmentSubmit(
  attachment: File,
  newId: number,
  provider: ProviderProps,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>
) {
  // const data = ;
  const newIdString = newId.toString();
  setChats((prev) => ({
    ...prev,
    [provider.id]: [
      ...prev[provider.id],
      {
        id: newIdString,
        sender: "You",
        content: { response: attachment.name, success: true },
        timestamp: Date.now(),
        attachment: {
          fileName: attachment.name,
          size: attachment.size,
          type: attachment.type,
          file: URL.createObjectURL(attachment),
        },
      },
    ],
  }));
}

export async function messageResponse(
  message: string,
  newId: number,
  provider: ProviderProps,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  context?: MessageContext[]
) {
  const response = await chatRequest(
    provider.provider,
    provider.model,
    message,
    context
  );
  const newIdString2 = `${newId}:r`;
  setChats((prev) => ({
    ...prev,
    [provider.id]: [
      ...prev[provider.id],
      {
        id: newIdString2,
        sender: provider,
        content: response,
        timestamp: Date.now(),
      },
    ],
  }));
}
