"use client";

import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatsPane } from "@/components/chat/chatsPane";
import { ChatList, EmptyChatList } from "@/components/chat/chatList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import { BouncingLoader } from "@/components/bouncingLoader";
import { ChatHeader } from "@/components/chat/chatHeader";
import { useReducer, useTransition } from "react";
import { AddSession } from "./components/addSession";
import { Actions, SessionType } from "./types";
import { createNewSession, messageResponse, reducer } from "./functions";
import { MessageList } from "@/components/chat/messageList";
import {
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

interface ChatTestProps {
  sessions: SessionType[];
  chats: ChatMessagesProps;
  user: string;
  onMessage?: (
    message: MessageProps | MessageProps[],
    contactId: string
  ) => Promise<void> | void;
  onAddRemoveSession?: (session: string | SessionType) => Promise<void> | void;
}

export default function TestChat({
  chats: initChats,
  sessions: initSessions,
  onMessage,
  onAddRemoveSession,
}: ChatTestProps) {
  const [state, dispatch] = useReducer(reducer, {
    chats: initChats,
    sessions: initSessions,
    selected: null,
  });
  const [isPending, startTransition] = useTransition();

  const onDeleteSession = async (session: SessionType) => {
    dispatch({ action: Actions.DELETE_SESSION, sessionId: session.id });
    await onAddRemoveSession?.(session.id);
  };

  const onEditSession = async <K extends keyof SessionType>(
    session: SessionType,
    field: K,
    value: SessionType[K]
  ) => {
    const newSession = {
      ...session,
      [field]: value,
    };
    dispatch({ action: Actions.EDIT_SESSION, newSession });
    await onAddRemoveSession?.(newSession);
  };

  const onAddSession = async (name: string = "") => {
    const newSession = createNewSession(name);
    dispatch({ action: Actions.ADD_SESSION, session: newSession });
    await onAddRemoveSession?.(newSession);
  };

  const selectSession = (session: SessionType | null) => {
    if (session)
      dispatch({ action: Actions.SELECT_SESSION, sessionId: session.id });
    else dispatch({ action: Actions.UNSELECT_SESSION });
  };

  const onMessageHandler = async (
    messages: InputOutput | MessageContentStatus,
    type: TypeMessage
  ) => {
    const selected = state.selected;
    if (!selected) return;

    if (type === TypeMessage.MESSAGE && !(messages as InputOutput).text.trim())
      return;

    const newMessage = sendMessageHandler(messages, type, selected.id);
    dispatch({
      action: Actions.ADD_MESSAGE,
      message: newMessage,
      sessionId: selected.id,
    });

    await onMessage?.(newMessage, selected.id);
    if (newMessage.type !== TypeMessage.MESSAGE) return;

    startTransition(async () => {
      const response = await messageResponse({
        message: messages.text,
        newId: newMessage.id,
        session: selected,
      });
      dispatch({
        action: Actions.ADD_MESSAGE,
        message: response,
        sessionId: selected.id,
      });
      await onMessage?.(response, selected.id);
    });
  };

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
                setSelectedSender={selectSession}
              />
            )
          }
        />
      }
      MessagePane={
        !state.selected ? (
          <EmptyMessagesPane />
        ) : (
          <MessagesPane
            header={
              <MessagesHeader
                sender={state.selected}
                options={
                  <ChatbotOptions
                    session={state.selected}
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
                onSubmit={onMessageHandler}
                disabled={isPending}
                attachment={false}
                record={false}
              />
            }
          />
        )
      }
    />
  );
}
