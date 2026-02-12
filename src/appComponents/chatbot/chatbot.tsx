"use client";

import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatsPane } from "@/components/chat/chatsPane";
import { ChatList, EmptyChatList } from "@/components/chat/chatList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import { BouncingLoader } from "@/components/bouncingLoader";
import { ChatHeader } from "@/components/chat/chatHeader";
import { useReducer } from "react";
import { MessageList } from "@/components/chat/messageList";
import {
  BaseSender,
  ChatMessagesProps,
  MessageContentStatus,
  MessageProps,
  TypeMessage,
} from "@/libs/chat/types";
import { MessagesHeader } from "@/components/chat/messagesHeader";
import { MessageInput } from "@/components/chat/input/messageInput";
import { InputOutput } from "@/components/chat/input/types";
import { reducer } from "@/libs/chat/state/functions";
import { Actions } from "@/libs/chat/state/types";
import { MultipleMessage } from "@/components/chat/input/multipleMessages";
import { ChatbotStorageBase } from "@/libs/chat/storage/storageBase";
import { ADKState, SessionType } from "@/libs/chat/adk/types";
import { AddSession } from "@/components/chat/adk/addSession";
import { SessionOptions } from "@/components/chat/adk/sessionOptions";
import {
  addSession,
  deleteSession,
  getSessionState,
  sendMessage,
  updateSession,
  updateSessionState,
} from "@/libs/chat/adk/functions";
import { adk_api_chatbot, app_name } from "./constants";

interface ChatBotProps {
  sessions: SessionType[];
  chats: ChatMessagesProps;
  user: string;
  storage?: ChatbotStorageBase;
}

export function Chatbot({
  chats: initChats,
  sessions: initSessions,
  user,
  storage,
}: ChatBotProps) {
  const [state, dispatch] = useReducer(reducer, {
    selected: null,
    sessions: initSessions,
    chats: initChats,
    pending: [],
  });

  const onDeleteSession = async (session: SessionType) => {
    await deleteSession(
      {
        sessionId: session.id,
        userId: user,
        app_name: app_name,
      },
      dispatch,
      storage,
    );
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
    await updateSession({ session: newSession }, dispatch, storage);
  };

  const onAddSession = async (name: string = "") => {
    await addSession({ name }, dispatch, storage);
  };

  const onGetState = async (session: SessionType) => {
    await getSessionState(
      {
        session,
        app_name,
        user,
      },
      dispatch,
      storage,
    );
  };

  const onUpdateState = async (session: SessionType, state: ADKState) => {
    await updateSessionState(
      {
        session,
        app_name,
        user,
        data: state,
      },
      dispatch,
      storage,
    );
  };

  const onSendMessage = async (
    session: SessionType,
    messages: InputOutput | MessageContentStatus,
    type: TypeMessage,
  ) => {
    if (type === TypeMessage.MESSAGE && !(messages as InputOutput).text.trim())
      return;

    await sendMessage(
      {
        sessionId: session.id,
        messages,
        type,
        userId: user,
        url: adk_api_chatbot,
        app_name,
      },
      dispatch,
      storage,
    );
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
                    onGetState={onGetState}
                    onUpdateState={onUpdateState}
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
                  onSendMessage(state.selected as SessionType, value, type)
                }
                disabled={isPending}
                attachment={false}
                record={false}
                otherOptions={(value, clear, disabled) => (
                  <MultipleMessage
                    disabled={disabled || state.sessions.length < 2}
                    sessions={state.sessions}
                    sendMessage={async (session) => {
                      clear();
                      await onSendMessage(
                        session as SessionType,
                        value,
                        TypeMessage.MESSAGE,
                      );
                    }}
                  />
                )}
              />
            }
          />
        )
      }
    />
  );
}
