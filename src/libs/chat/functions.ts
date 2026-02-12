import {
  ChatMessagesProps,
  MessageContentStatus,
  MessageContext,
  MessageFlattenProps,
  MessageProps,
  Part,
  PartType,
  TypeMessage,
} from "./types";
import { ContextSettings } from "@/appComponents/chat/types";
import { generateUUID } from "../uuid";
import { serverActionBodySizeLimit } from "@/appComponents/audioToText/constants";
import { formatBytes } from "../formatData";
import { InputOutput } from "@/components/chat/input/types";
import { makeInputParts } from "@/components/chat/input/function";

/**
 * Messages
 */
export function isStatusType(type: TypeMessage) {
  return type !== TypeMessage.MESSAGE;
}

export function isStatusMessage(message: MessageProps) {
  return [
    TypeMessage.ERROR,
    TypeMessage.INFO,
    TypeMessage.SUCCESS,
    TypeMessage.WARNING,
  ].includes(message.type);
}

export function getPartType(part: Part): PartType | undefined {
  return Object.keys(part)[0] as PartType | undefined;
}

export function sortedSenders(chats: ChatMessagesProps) {
  const list = Object.keys(chats) as (keyof ChatMessagesProps)[];
  list.sort((c1, c2) => {
    const m1 = chats[c1].at(-1);
    const m2 = chats[c2].at(-1);
    if (!m1 && !m2) return 1;
    if (m1 && m2) return m1.timestamp < m2.timestamp ? 1 : -1;
    if (m1) return -1;
    return 1;
  });
  return list;
}

interface ContextMessageFilter {
  max?: number;
  elapsedTimeMs?: number;
}

function flattenMessagesFilter(
  messages: MessageProps[],
  {
    max = Number.MAX_SAFE_INTEGER,
    elapsedTimeMs = Number.MAX_SAFE_INTEGER,
  }: ContextMessageFilter,
) {
  const now = Date.now();
  const allMessages = messages.reduceRight((acc, m) => {
    if (
      m.type !== TypeMessage.MESSAGE ||
      acc.length > max ||
      now - m.timestamp > elapsedTimeMs
    )
      return acc;
    const { content, ...other } = m;
    const allm = m.content.map((mm) => ({
      ...other,
      content: mm,
    }));

    const size = acc.push(...allm);
    return size > max ? acc.slice(-Math.max(max, 0)) : acc;
  }, [] as MessageFlattenProps[]);
  return allMessages;
}

function formatContextMessages(
  messages: MessageFlattenProps[],
): MessageContext[] {
  const filteredMessages = messages.filter(
    (m) =>
      m.type === TypeMessage.MESSAGE &&
      getPartType(m.content as Part) === PartType.TEXT &&
      !("thought" in m.content),
  );
  return filteredMessages.map((m) => ({
    role: m.origin === "received" ? "assistant" : "user",
    content: (m.content as Part).text as string,
  }));
}

export function contextMessages(
  messages: MessageProps[],
  { max = 10, elapsedTimeMs = Number.MAX_SAFE_INTEGER }: ContextMessageFilter,
): MessageContext[] {
  return formatContextMessages(
    flattenMessagesFilter(messages, { max, elapsedTimeMs }),
  );
}

export function makeMessageSend(
  content: Part[],
  newId: string,
  senderId: string,
  raw?: object,
): MessageProps {
  return {
    id: newId,
    senderId,
    content,
    raw,
    type: TypeMessage.MESSAGE,
    timestamp: Date.now(),
    origin: "sent",
  };
}

export function makeMessageStatusSend({
  id,
  type,
  content,
  senderId,
  raw,
}: {
  id?: string;
  type: TypeMessage;
  content: MessageContentStatus;
  senderId: string;
  raw?: object;
}): MessageProps {
  const newId = id ?? generateUUID();
  return {
    id: `${newId}:r`,
    senderId,
    timestamp: Date.now(),
    origin: "received",
    type: type,
    content,
    raw: raw ?? content,
  } as MessageProps;
}

export function sendMessageHandler(
  messages: InputOutput | MessageContentStatus,
  type: TypeMessage,
  senderId: string,
): MessageProps {
  if (isStatusType(type)) {
    const msg = makeMessageStatusSend({
      type,
      content: messages as MessageContentStatus,
      senderId,
    });
    return msg;
  }

  const parts = makeInputParts(messages as InputOutput);
  const partFiltered = parts.find(
    (p) =>
      PartType.INLINE_DATA in p &&
      (p[PartType.INLINE_DATA]?.size ?? 0) > serverActionBodySizeLimit,
  );

  if (partFiltered) {
    const msg = makeMessageStatusSend({
      type: TypeMessage.WARNING,
      content: {
        name: "File Size Exceeded",
        text: `File '${
          partFiltered[PartType.INLINE_DATA]?.displayName
        }' is bigger than allowed size (${formatBytes(
          serverActionBodySizeLimit,
        )})`,
      },
      senderId,
    });
    return msg;
  }

  const newId = generateUUID();
  const newMessage = makeMessageSend(parts as Part[], newId, senderId);

  return newMessage;
}

export function mergeMessages(
  message: string,
  settings: ContextSettings,
  chats: MessageProps[],
) {
  const trimed = settings.systemPrompt.trim();
  const system = (
    trimed ? [{ role: "system", content: trimed }] : []
  ) as MessageContext[];
  const context = contextMessages(chats, {
    max: settings.maxContextMessages,
    elapsedTimeMs: settings.maxElapsedTimeMessages,
  });
  const user = { role: "user", content: message.trim() } as MessageContext;

  return system.concat(context, user);
}
