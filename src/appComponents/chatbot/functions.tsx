import { SessionType } from "./types";
import { sendQuery } from "@/actions/chatbot";
import { app_name } from "./constants";
import { generateUUID } from "@/libs/uuid";
import { Dispatch, SetStateAction } from "react";
import { ChatMessagesProps, MessageProps } from "@/libs/chat/types";

export function createNewSession(name: string = ""): SessionType {
  return {
    name: name || `Session-${Math.floor(Math.random() * 100)}`,
    id: generateUUID(),
    state: {},
  };
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
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>
) {
  const response = await sendQuery({
    app_name,
    session: session.id,
    user,
    parts: [{ text: message }],
  });

  const newMessages: MessageProps = {
    id: `${newId}:r`,
    senderId: session.id,
    content: response.content,
    timestamp: Date.now(),
    type: response.type,
    raw: response,
    origin: "received",
  } as MessageProps;
  setChats((prev) => ({
    ...prev,
    [session.id]: [...prev[session.id], newMessages],
  }));
  return newMessages;
}
