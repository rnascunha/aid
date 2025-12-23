import { SessionType } from "./types";
import { adk_api_events, app_name } from "./constants";
import { generateUUID } from "@/libs/uuid";
import { Dispatch, SetStateAction } from "react";
import {
  ChatMessagesProps,
  MessageProps,
  TypeMessage,
} from "@/libs/chat/types";
import { PartialDataAggregator, readQuerySSE } from "@/libs/adk/base";
import { ADKEvent } from "@/libs/adk/types";

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
  const response = await fetch(adk_api_events, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_name,
      user,
      session: session.id,
      url: adk_api_events,
      parts: [{ text: message }],
      streaming: true,
    }),
  });

  if (response.status !== 200 || !response.body)
    return {
      id: `${newId}:r`,
      senderId: session.id,
      content: {
        name: "Query Error",
        text: `Request status [${response.status} / ${response.statusText}]`,
      },
      timestamp: Date.now(),
      type: TypeMessage.ERROR,
      raw: response,
      origin: "received",
    } as MessageProps;

  const msgs: MessageProps[] = [];
  let count = 0;
  const partial = new PartialDataAggregator();

  await readQuerySSE(response, (data, error) => {
    if (error) {
      console.error(data);
      return;
    }

    const event = data as ADKEvent;
    console.dir(event, { depth: null });

    const was_partial = partial.addMessage(event);

    const newMessage: MessageProps = {
      id: `${newId}:r${count++}`,
      senderId: session.id,
      content:
        was_partial && event.partial ? partial.parts : event.content!.parts,
      timestamp: Date.now(),
      type: TypeMessage.MESSAGE,
      raw: event,
      origin: "received",
    } as MessageProps;

    if (was_partial) {
      setChats((prev) => {
        const data = prev[session.id].slice(0, -1);
        return { ...prev, [session.id]: [...data, newMessage] };
      });
    } else {
      setChats((prev) => ({
        ...prev,
        [session.id]: [...prev[session.id], newMessage],
      }));
    }

    if (!event.partial) {
      msgs.push(newMessage);
    }
  });

  return msgs;
}
