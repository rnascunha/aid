import { generateUUID } from "@/libs/uuid";
import { ADKData, ADKState, SessionType } from "./types";
import {
  deleteSession as deleteSessionAction,
  getSessionState as getSessionStateAction,
  updateSessionState as updateSessionStateAction,
} from "@/actions/adk/common";
import {
  MessageContentStatus,
  MessageProps,
  Part,
  PartType,
  TypeMessage,
} from "../types";
import { makeMessageStatusSend, sendMessageHandler } from "../functions";
import { Actions, ChatActionArgs } from "../state/types";
import { ActionDispatch } from "react";
import { StorageBase } from "../storage/storageBase";
import { InputOutput } from "@/components/chat/input/types";
import { PartialDataAggregator, readQuerySSE } from "@/libs/adk/base";
import { ADKEvent } from "@/libs/adk/types";

export function createNewSession(name: string = ""): SessionType {
  return {
    name: name || `Session-${Math.floor(Math.random() * 100)}`,
    id: generateUUID(),
    state: {},
  };
}

export async function addSession(
  { name = "" }: { name: string },
  dispatch: ActionDispatch<[action: ChatActionArgs]>,
  storage?: StorageBase,
) {
  const newSession = createNewSession(name);
  dispatch({
    action: Actions.ADD_SESSION,
    session: newSession,
  });
  await storage?.addSender(newSession);
}

export async function updateSession(
  { session }: { session: SessionType },
  dispatch: ActionDispatch<[action: ChatActionArgs]>,
  storage?: StorageBase,
) {
  dispatch({
    action: Actions.EDIT_SESSION,
    newSession: session,
  });
  await storage?.addSender(session);
}

export async function getSessionState(
  {
    app_name,
    session,
    user,
  }: { session: SessionType; app_name: string; user: string },
  dispatch: ActionDispatch<[action: ChatActionArgs]>,
  storage?: StorageBase,
) {
  const response = await getSessionStateAction({
    app_name,
    session: session.id,
    user,
  });
  if (response.type !== TypeMessage.SUCCESS) {
    const message = makeMessageStatusSend({
      type: response.type,
      content: response.content,
      raw: response.raw as Record<string, unknown>,
      senderId: session.id,
    });
    dispatch({
      action: Actions.ADD_MESSAGE,
      message,
      sessionId: session.id,
    });
    await storage?.addMessage(message);
    return;
  }
  await updateSession(
    {
      session: {
        ...session,
        state: response.raw as unknown as ADKState,
      },
    },
    dispatch,
    storage,
  );
  return response;
}

export async function updateSessionState(
  {
    app_name,
    session,
    user,
    data,
  }: { session: SessionType; app_name: string; user: string; data: ADKState },
  dispatch: ActionDispatch<[action: ChatActionArgs]>,
  storage?: StorageBase,
) {
  const response = await updateSessionStateAction({
    app_name,
    session: session.id,
    user,
    data,
  });
  if (response.type !== TypeMessage.SUCCESS) {
    const message = makeMessageStatusSend({
      type: response.type,
      content: response.content,
      raw: response.raw as Record<string, unknown>,
      senderId: session.id,
    });
    dispatch({
      action: Actions.ADD_MESSAGE,
      message,
      sessionId: session.id,
    });
    await storage?.addMessage(message);
    return;
  }
  await updateSession(
    {
      session: {
        ...session,
        state: response.raw as unknown as ADKState,
      },
    },
    dispatch,
    storage,
  );
  return response;
}

export async function deleteSession(
  {
    app_name,
    sessionId,
    userId,
  }: {
    app_name: string;
    sessionId: string;
    userId: string;
  },
  dispatch: ActionDispatch<[action: ChatActionArgs]>,
  storage?: StorageBase,
) {
  const ret = await deleteSessionAction({
    app_name,
    session: sessionId,
    user: userId,
  });
  if (ret.type !== TypeMessage.SUCCESS) {
    const message = makeMessageStatusSend({
      type: ret.type,
      content: ret.content,
      raw: ret.raw as Record<string, unknown>,
      senderId: sessionId,
    });
    dispatch({
      action: Actions.ADD_MESSAGE,
      message,
      sessionId: sessionId,
    });
    await storage?.addMessage(message);
    return;
  }
  dispatch({ action: Actions.DELETE_SESSION, sessionId: sessionId });
  await storage?.deleteSender(sessionId);
}

async function getResponseBodyError(response: Response) {
  try {
    return await response.json();
  } catch {
    return {
      status: response.status,
      statusText: response.statusText,
    };
  }
}

function inputOutputToParts(messages: InputOutput) {
  const files = messages.files.map((f) => ({
    [PartType.INLINE_DATA]: { mimeType: f.mimeType, data: f.data },
  }));
  const parts: Part[] = [
    messages.text ? { [PartType.TEXT]: messages.text } : undefined,
    ...files,
  ].filter((f) => f) as Part[];
  return parts;
}

async function messageResponse(
  {
    parts,
    newId,
    user,
    sessionId,
    url,
    app_name,
  }: {
    parts: Part[];
    newId: string;
    user: string;
    sessionId: string;
    url: string;
    app_name: string;
  },
  dispatch: ActionDispatch<[action: ChatActionArgs]>,
) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_name,
      user,
      session: sessionId,
      parts,
      streaming: true,
    }),
  });

  if (response.status !== 200 || !response.body) {
    const raw = await getResponseBodyError(response);
    const errorMessage = {
      id: `${newId}:r`,
      senderId: sessionId,
      content: {
        name: "Query Error",
        text: `Request status [${response.status} / ${response.statusText}]`,
      },
      timestamp: Date.now(),
      type: TypeMessage.ERROR,
      raw,
      origin: "received",
    } as MessageProps;
    dispatch({
      action: Actions.ADD_MESSAGE,
      sessionId: sessionId,
      message: errorMessage,
    });
    return errorMessage;
  }

  const msgs: MessageProps[] = [];
  let count = 0;
  const partial = new PartialDataAggregator();

  await readQuerySSE(response, (data, error) => {
    if (error) {
      console.error(data);
      return;
    }

    const event = data as ADKEvent;
    const was_partial = partial.addMessage(event);
    const content =
      was_partial && event.partial ? partial.parts : event.content?.parts;

    if (!content) return msgs;

    const newMessage: MessageProps = {
      id: `${newId}:r${count++}`,
      senderId: sessionId,
      content,
      timestamp: Date.now(),
      type: TypeMessage.MESSAGE,
      raw: event,
      origin: "received",
    } as MessageProps;

    if (was_partial) {
      dispatch({
        action: Actions.SLICE_ADD_MESSAGES,
        messages: [newMessage],
        slice: [0, -1],
        sessionId: sessionId,
      });
    } else {
      dispatch({
        action: Actions.ADD_MESSAGE,
        sessionId: sessionId,
        message: newMessage,
      });
    }

    if (!event.partial) {
      msgs.push(newMessage);
    }
  });

  return msgs;
}

export async function sendMessage(
  {
    sessionId,
    messages,
    type,
    userId,
    url,
    app_name,
  }: {
    sessionId: string;
    messages: InputOutput | MessageContentStatus;
    type: TypeMessage;
    userId: string;
    url: string;
    app_name: string;
  },
  dispatch: ActionDispatch<[action: ChatActionArgs]>,
  storage?: StorageBase,
) {
  const newMessage = sendMessageHandler(messages, type, sessionId);
  dispatch({
    action: Actions.ADD_MESSAGE,
    message: newMessage,
    sessionId,
  });
  await storage?.addMessage(newMessage);

  if (newMessage.type !== TypeMessage.MESSAGE) return;

  dispatch({ action: Actions.ADD_PENDING, sessionId });

  const parts = inputOutputToParts(messages as InputOutput);
  try {
    const response = await messageResponse(
      {
        parts,
        user: userId,
        newId: newMessage.id,
        sessionId,
        url,
        app_name,
      },
      dispatch,
    );
    await storage?.addMessage(response);
  } catch (e) {
    console.error(e);
  } finally {
    dispatch({ action: Actions.REMOVE_PENDING, sessionId: sessionId });
  }
}

export async function getData({
  storage,
  defaultData,
}: {
  storage?: StorageBase;
  defaultData: ADKData;
}): Promise<ADKData> {
  if (!storage) return defaultData;

  const sessions = (await storage.getSenders()) as SessionType[];
  const chats = await storage.getMessages(sessions.map((m) => m.id));
  return {
    sessions,
    chats,
  };
}
