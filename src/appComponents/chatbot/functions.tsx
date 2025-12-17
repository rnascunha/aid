import {
  ChatMessagesChatbotProps,
  MessageChatbotProps,
  SessionType,
} from "./types";
import { sendQuery } from "@/actions/chatbot";
import { app_name } from "./constants";
import { generateUUID } from "@/libs/uuid";
import { Dispatch, SetStateAction } from "react";
import { ChatMessage } from "@/libs/chat/types";
import { Part, PartText } from "@/actions/adk/types";

export function createNewSession(name: string = ""): SessionType {
  return {
    name: name || `Session-${Math.floor(Math.random() * 100)}`,
    id: generateUUID(),
    state: {},
  };
}

export function messageSubmit(
  {
    message,
    session,
    newId,
  }: {
    message: string;
    session: SessionType;
    newId: string;
  },
  setChats: Dispatch<SetStateAction<ChatMessagesChatbotProps>>
): MessageChatbotProps {
  const newMessage = {
    id: newId,
    sender: "You",
    content: { response: message, success: true },
    timestamp: Date.now(),
  } as MessageChatbotProps;
  setChats((prev) => ({
    ...prev,
    [session.id]: [...prev[session.id], newMessage],
  }));
  return newMessage;
}

function getContents(response: Record<string, unknown>[]) {
  const parts = (response[0].content as Record<string, unknown>)
    .parts as Part[];
  return parts.map((p) => ({
    success: true as const,
    data: response,
    response: (p as PartText).text,
  }));
}

export async function messageResponse(
  {
    message,
    newId,
    user,
    session,
  }: {
    message: string;
    newId: string;
    user: string;
    session: SessionType;
  },
  setChats: Dispatch<SetStateAction<ChatMessagesChatbotProps>>
) {
  const response = await sendQuery({
    app_name,
    session: session.id,
    user,
    parts: [{ text: message }],
  });

  const contents: ChatMessage[] = response.ok
    ? getContents(response.data)
    : [
        {
          error: response.error,
          detail: response.detail!.message,
          code: 0,
        },
      ];

  const newMessages = contents.map((c, i) => ({
    id: `${newId}:r${i}`,
    sender: session,
    content: c,
    timestamp: Date.now(),
  }));
  setChats((prev) => ({
    ...prev,
    [session.id]: [...prev[session.id], ...newMessages],
  }));
  return newMessages;
}
