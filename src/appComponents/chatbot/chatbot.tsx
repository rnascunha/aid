"use client";

import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatsPane } from "@/components/chat/chatsPane";
import { ChatList, EmptyChatList } from "@/components/chat/chatList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import { BouncingLoader } from "@/components/bouncingLoader";
import { ChatHeader } from "@/components/chat/chatHeader";
import { useReducer } from "react";
import { AddSession } from "./components/addSession";
import { SessionType } from "./types";
import { createNewSession, messageResponse } from "./functions";
import { MessageList } from "@/components/chat/messageList";
import {
  BaseSender,
  ChatMessagesProps,
  MessageContentStatus,
  MessageProps,
  TypeMessage,
} from "@/libs/chat/types";
import { sendMessageHandler } from "@/libs/chat/functions";
import { MessagesHeader } from "@/components/chat/messagesHeader";
import { ChatbotOptions } from "./components/sessionOptions";
import { MessageInput } from "@/components/chat/input/messageInput";
import { InputOutput } from "@/components/chat/input/types";
import { reducer } from "@/libs/chat/state/functions";
import { Actions } from "@/libs/chat/state/types";
import { MultipleMessage } from "@/components/chat/input/multipleMessages";

interface ChatBotProps {
  sessions: SessionType[];
  chats: ChatMessagesProps;
  user: string;
  onMessage?: (
    message: MessageProps | MessageProps[],
    contactId: string,
  ) => Promise<void> | void;
  onAddRemoveSession?: (session: string | SessionType) => Promise<void> | void;
}

export default function ChatBot({
  chats: initChats,
  sessions: initSessions,
  user,
  onMessage,
  onAddRemoveSession,
}: ChatBotProps) {
  const [state, dispatch] = useReducer(reducer, {
    selected: null,
    sessions: initSessions,
    chats: initChats,
    pending: [],
  });

  const onDeleteSession = async (session: SessionType) => {
    dispatch({ action: Actions.DELETE_SESSION, sessionId: session.id });
    await onAddRemoveSession?.(session.id);
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
    await onAddRemoveSession?.(newSession);
  };

  const onAddSession = async (name: string = "") => {
    const newSession = createNewSession(name);
    dispatch({
      action: Actions.ADD_SESSION,
      session: newSession,
    });
    await onAddRemoveSession?.(newSession);
  };

  const sendMessage = async (
    session: SessionType,
    messages: InputOutput | MessageContentStatus,
    type: TypeMessage,
  ) => {
    if (type === TypeMessage.MESSAGE && !(messages as InputOutput).text.trim())
      return;

    const newMessage = sendMessageHandler(messages, type, session.id);
    dispatch({
      action: Actions.ADD_MESSAGE,
      message: newMessage,
      sessionId: session.id,
    });

    await onMessage?.(newMessage, session.id);
    if (newMessage.type !== TypeMessage.MESSAGE) return;

    dispatch({ action: Actions.ADD_PENDING, sessionId: session.id });
    try {
      const response = await messageResponse(
        {
          message: messages.text,
          user,
          newId: newMessage.id,
          session: session,
        },
        dispatch,
      );
      await onMessage?.(response, session.id);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ action: Actions.REMOVE_PENDING, sessionId: session.id });
    }
  };

  const setSelectedSession = (session: SessionType | null) => {
    if (!session) {
      dispatch({ action: Actions.UNSELECT_SESSION });
      return;
    }
    dispatch({ action: Actions.SELECT_SESSION, sessionId: session.id });
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
                  <ChatbotOptions
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
                disabled={isPending}
                attachment={false}
                record={false}
                otherOptions={(value, clear, disabled) => (
                  <MultipleMessage
                    disabled={disabled || state.sessions.length < 2}
                    sessions={state.sessions}
                    sendMessage={async (session) => {
                      clear();
                      await sendMessage(
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
