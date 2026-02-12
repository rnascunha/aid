"use client";

import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatHeader } from "@/components/chat/chatHeader";
import { ChatsPane } from "@/components/chat/chatsPane";
import { reducer } from "@/libs/chat/state/functions";
import { useReducer, useState } from "react";
// import { SessionType } from "./types";
import { Actions } from "@/libs/chat/state/types";
import { AgentTrevelerStorageBase } from "@/libs/chat/storage/storageBase";
import {
  BaseSender,
  ChatMessagesProps,
  MessageContentStatus,
  MessageProps,
  TypeMessage,
} from "@/libs/chat/types";
import { InputOutput } from "@/components/chat/input/types";
import { sendMessageHandler } from "@/libs/chat/functions";
import { ChatList, EmptyChatList } from "@/components/chat/chatList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import { MessagesHeader } from "@/components/chat/messagesHeader";
import { BouncingLoader } from "@/components/bouncingLoader";
import { MessageList } from "@/components/chat/messageList";
import { MessageInput } from "@/components/chat/input/messageInput";
import { createNewSession, messageResponse } from "./functions";
import { SessionType } from "@/libs/chat/adk/types";
import { AddSession } from "@/components/chat/adk/addSession";
import { SessionOptions } from "@/components/chat/adk/sessionOptions";
// import { AddSession } from "./components/addSession";
// import { SessionOptions } from "./components/sessionOptions";

interface AgentTravelerProps {
  sessions: SessionType[];
  chats: ChatMessagesProps;
  user: string;
  storage?: AgentTrevelerStorageBase;
}

export function AgentTraveler({
  chats: initChats,
  sessions: initSessions,
  user,
  storage,
}: AgentTravelerProps) {
  const [state, dispatch] = useReducer(reducer, {
    selected: null,
    sessions: initSessions,
    chats: initChats,
    pending: [],
  });
  const [hasFiles, setHasFiles] = useState(false);

  const onDeleteSession = async (session: SessionType) => {
    dispatch({ action: Actions.DELETE_SESSION, sessionId: session.id });
    await storage?.deleteSender(session.id);
  };

  const onEditSession = async <K extends keyof SessionType>(
    session: SessionType,
    field: K,
    value: SessionType[K],
  ) => {
    const newSession = {
      ...session,
      [field]: value,
    };
    dispatch({
      action: Actions.EDIT_SESSION,
      newSession,
    });
    await storage?.addSender(newSession);
  };

  const onAddSession = async (name: string = "") => {
    const newSession = createNewSession(name);
    dispatch({
      action: Actions.ADD_SESSION,
      session: newSession,
    });
    await storage?.addSender(newSession);
  };

  const sendMessage = async (
    session: SessionType,
    messages: InputOutput | MessageContentStatus,
    type: TypeMessage,
  ) => {
    if (
      type === TypeMessage.MESSAGE &&
      (messages as InputOutput).files.length === 0
    )
      return;

    const newMessage = sendMessageHandler(messages, type, session.id);
    dispatch({
      action: Actions.ADD_MESSAGE,
      message: newMessage,
      sessionId: session.id,
    });
    await storage?.addMessage(newMessage);

    if (newMessage.type !== TypeMessage.MESSAGE) return;

    dispatch({ action: Actions.ADD_PENDING, sessionId: session.id });
    try {
      const response = await messageResponse(
        {
          messages: messages as InputOutput,
          user,
          newId: newMessage.id,
          session: session,
        },
        dispatch,
      );
      await storage?.addMessage(response);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ action: Actions.REMOVE_PENDING, sessionId: session.id });
      setHasFiles(false);
    }
  };

  const setSelectedSession = (session: SessionType | null) => {
    dispatch({
      action: Actions.SELECT_SESSION,
      sessionId: session?.id ?? null,
    });
  };

  const isPending = state.selected?.id
    ? state.pending.includes(state.selected.id)
    : false;

  return (
    <ChatContainer
      chatHeader={
        <ChatHeader
          chatTitle="Sessions"
          chatOptions={<AddSession onAddSession={onAddSession} />}
        />
      }
      chatsPane={
        <ChatsPane
          modelsList={
            state.sessions.length === 0 ? (
              <EmptyChatList addModelButton={<div></div>} />
            ) : (
              <ChatList
                senders={state.sessions}
                chats={state.chats}
                selectedSender={state.selected}
                setSelectedSender={
                  setSelectedSession as (s: BaseSender | null) => void
                }
              />
            )
          }
        />
      }
      messagePane={
        !state.selected ? (
          <EmptyMessagesPane />
        ) : (
          <MessagesPane
            header={
              <MessagesHeader
                sender={state.selected}
                options={
                  <SessionOptions
                    session={state.selected as SessionType}
                    onDeleteSession={onDeleteSession}
                    onEditSession={onEditSession}
                  />
                }
              />
            }
            loader={isPending && <BouncingLoader />}
            messages={
              <MessageList
                messages={state.chats[state.selected.id] as MessageProps[]}
              />
            }
            input={
              <MessageInput
                onSubmit={(value, type) =>
                  sendMessage(state.selected as SessionType, value, type)
                }
                submit={{
                  disabled: !hasFiles,
                }}
                onInputChange={(data) => setHasFiles(data.files.length !== 0)}
                disabled={isPending}
                attachment={{
                  multiple: true,
                  accept: "application/pdf,text/pdf,image/*",
                }}
                record={false}
              />
            }
          />
        )
      }
    />
  );
}
