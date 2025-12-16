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

function getContentText(response: Record<string, unknown>) {
  const parts = (response.content as Record<string, unknown>).parts as Part[];
  const data = parts.find((p) => !("thought" in p));
  return (data as PartText).text;
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

  const content: ChatMessage = response.ok
    ? {
        success: true,
        data: response.data,
        response: getContentText(response.data[0]),
      }
    : {
        error: response.error,
        detail: response.detail!.message,
        code: 0,
      };

  const newIdString = `${newId}:r`;
  const newMessage = {
    id: newIdString,
    sender: session,
    content,
    timestamp: Date.now(),
  } as MessageChatbotProps;
  setChats((prev) => ({
    ...prev,
    [session.id]: [...prev[session.id], newMessage],
  }));
  return newMessage;
}
