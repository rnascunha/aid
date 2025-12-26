import { Dispatch, SetStateAction } from "react";
import {
  BaseSender,
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
import { serverActionBodySizeLimit } from "@/appComponents/audioToText/contants";
import { formatBytes } from "../formatData";

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

// function flattenMessages(messages: MessageProps[]): MessageFlattenProps[] {
//   return messages.reduce((acc, m) => {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { content, ...other } = m;
//     const allm = m.content.map((mm) => ({
//       ...other,
//       content: mm,
//     }));

//     acc.push(...allm);
//     return acc;
//   }, [] as MessageFlattenProps[]);
// }

interface ContextMessageFilter {
  max?: number;
  elapsedTimeMs?: number;
}

function flattenMessagesFilter(
  messages: MessageProps[],
  {
    max = Number.MAX_SAFE_INTEGER,
    elapsedTimeMs = Number.MAX_SAFE_INTEGER,
  }: ContextMessageFilter
) {
  const now = Date.now();
  const allMessages = messages.reduceRight((acc, m) => {
    if (
      m.type !== TypeMessage.MESSAGE ||
      acc.length > max ||
      now - m.timestamp > elapsedTimeMs
    )
      return acc;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  messages: MessageFlattenProps[]
): MessageContext[] {
  const filteredMessages = messages.filter(
    (m) =>
      m.type === TypeMessage.MESSAGE &&
      getPartType(m.content as Part) === PartType.TEXT &&
      !("thought" in m.content)
  );
  return filteredMessages.map((m) => ({
    role: m.origin === "received" ? "assistant" : "user",
    content: (m.content as Part).text as string,
  }));
}

export function contextMessages(
  messages: MessageProps[],
  { max = 10, elapsedTimeMs = Number.MAX_SAFE_INTEGER }: ContextMessageFilter
): MessageContext[] {
  return formatContextMessages(
    flattenMessagesFilter(messages, { max, elapsedTimeMs })
  );
}

export function makeMessageSend(
  content: Part[],
  newId: string,
  senderId: string,
  raw?: object
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

export function messageSendSubmit(
  content: Part[],
  newId: string,
  senderId: string,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>
) {
  const newMessage = makeMessageSend(content, newId, senderId);
  setChats((prev) => ({
    ...prev,
    [senderId]: [...prev[senderId], newMessage],
  }));
  return newMessage;
}

export function messageStatusReceive({
  id,
  type,
  content,
  senderId,
  setChats,
  raw,
}: {
  id?: string;
  type: TypeMessage;
  content: MessageContentStatus;
  senderId: string;
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>;
  raw?: object;
}) {
  const newId = id ?? generateUUID();
  const responseMessage: MessageProps = {
    id: `${newId}:r`,
    senderId,
    timestamp: Date.now(),
    origin: "received",
    type: type,
    content,
    raw: raw ?? content,
  } as MessageProps;
  setChats((prev) => ({
    ...prev,
    [senderId]: [...prev[senderId], responseMessage],
  }));

  return responseMessage;
}

export function onMessageSendHandler(
  messages: Part[] | MessageContentStatus,
  type: TypeMessage,
  senderId: string,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>
) {
  if (isStatusType(type)) {
    const msg = messageStatusReceive({
      type,
      content: messages as MessageContentStatus,
      senderId,
      setChats,
    });
    return msg;
  }

  const parts = messages as Part[];
  const partFiltered = parts.find(
    (p) =>
      PartType.INLINE_DATA in p &&
      (p[PartType.INLINE_DATA]?.size ?? 0) > serverActionBodySizeLimit
  );

  if (partFiltered) {
    const msg = messageStatusReceive({
      type: TypeMessage.WARNING,
      content: {
        name: "File Size Exceeded",
        text: `File '${
          partFiltered[PartType.INLINE_DATA]?.displayName
        }' is bigger than allowed size (${formatBytes(
          serverActionBodySizeLimit
        )})`,
      },
      senderId,
      setChats,
    });
    return msg;
  }

  const newId = generateUUID();
  const newMessage = messageSendSubmit(
    parts as Part[],
    newId,
    senderId,
    setChats
  );

  return newMessage;
}

export function mergeMessages(
  message: string,
  settings: ContextSettings,
  chats: MessageProps[]
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

/**
 *  Senders
 */

export async function onDeleteMessages(
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  senderId?: string
) {
  if (senderId) {
    setChats((prev) => ({
      ...prev,
      [senderId]: [],
    }));
    return;
  }
  setChats((prev) =>
    Object.keys(prev).reduce((acc, v) => {
      acc[v] = [];
      return acc;
    }, {} as ChatMessagesProps)
  );
}

function removeSender(
  senderId: string,
  senders: BaseSender[],
  setSender: Dispatch<SetStateAction<BaseSender[]>>,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  setSelectedSender: Dispatch<SetStateAction<BaseSender | null>>
) {
  setSender((prev) => prev.filter((f) => f.id !== senderId));
  setSelectedSender((prev) =>
    prev === null
      ? null
      : prev.id !== senderId
      ? prev
      : (senders.find((f) => f.id !== senderId) as BaseSender) ?? null
  );
  setChats((prev) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [senderId]: remove, ...rest } = prev;
    return rest;
  });
}

function addSender(
  sender: BaseSender,
  senders: BaseSender[],
  setSenders: Dispatch<SetStateAction<BaseSender[]>>,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  setSelectedSender: Dispatch<SetStateAction<BaseSender | null>>
) {
  setSenders((prev) => [...prev, sender]);
  setChats((prev) => ({ ...prev, [sender.id]: [] }));
  if (senders.length === 0) setSelectedSender(sender);
}

export function addRemoveSender(
  sender: string | BaseSender,
  senders: BaseSender[],
  setSenders: Dispatch<SetStateAction<BaseSender[]>>,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  setSelectedSender: Dispatch<SetStateAction<BaseSender | null>>
) {
  if (typeof sender === "string") {
    //Removing
    removeSender(sender, senders, setSenders, setChats, setSelectedSender);
    return;
  }
  // Adding
  addSender(sender, senders, setSenders, setChats, setSelectedSender);
}
