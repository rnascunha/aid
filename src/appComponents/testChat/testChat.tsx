"use client";

import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatsPane } from "@/components/chat/chatsPane";
import { ChatList, EmptyChatList } from "@/components/chat/chatList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import { ChatHeader } from "@/components/chat/chatHeader";
import { useReducer } from "react";
import { AddSession } from "./components/addSession";
import { SessionTestType } from "./types";
import { createNewSession, messageResponse } from "./functions";
import {
  ChatMessagesProps,
  MessageContentStatus,
  MessageProps,
  TypeMessage,
} from "@/libs/chat/types";
import { sendMessageHandler } from "@/libs/chat/functions";
import { InputOutput } from "@/components/chat/input/types";
import { Stack } from "@mui/material";
import { MultipleMessage } from "../../components/chat/input/multipleMessages";
import { MessagesHeader } from "@/components/chat/messagesHeader";
import { ChatbotOptions } from "./components/sessionOptions";
import { MessageInput } from "@/components/chat/input/messageInput";
import { MessageList } from "@/components/chat/messageList";
import { BouncingLoader } from "@/components/bouncingLoader";
import { Actions } from "@/libs/chat/state/types";
import { reducer } from "@/libs/chat/state/functions";

interface ChatTestProps {
  sessions: SessionTestType[];
  chats: ChatMessagesProps;
  user: string;
  onMessage?: (
    message: MessageProps | MessageProps[],
    contactId: string,
  ) => Promise<void> | void;
  onAddRemoveSession?: (
    session: string | SessionTestType,
  ) => Promise<void> | void;
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
    pending: [],
  });
  const onDeleteSession = async (session: SessionTestType) => {
    dispatch({ action: Actions.DELETE_SESSION, sessionId: session.id });
    await onAddRemoveSession?.(session.id);
  };

  const onEditSession = async <K extends keyof SessionTestType>(
    session: SessionTestType,
    field: K,
    value: SessionTestType[K],
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

  const selectSession = (session: SessionTestType | null) => {
    if (session)
      dispatch({ action: Actions.SELECT_SESSION, sessionId: session.id });
    else dispatch({ action: Actions.UNSELECT_SESSION });
  };

  const sendMessage = async (
    session: SessionTestType,
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
      const response = await messageResponse({
        message: messages.text,
        newId: newMessage.id,
        session: session,
      });
      dispatch({
        action: Actions.ADD_MESSAGE,
        message: response,
        sessionId: session.id,
      });
      await onMessage?.(response, session.id);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ action: Actions.REMOVE_PENDING, sessionId: session.id });
    }
  };

  const isPending = state.selected?.id
    ? state.pending.includes(state.selected.id)
    : false;

  return (
    <ChatContainer
      chatHeader={
        <ChatHeader
          chatTitle="Sessions"
          chatOptions={
            <Stack direction="row">
              <AddSession onAddSession={onAddSession} />
            </Stack>
          }
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
      messagePane={
        !state.selected ? (
          <EmptyMessagesPane />
        ) : (
          <MessagesPane
            key={state.selected.id}
            header={
              <MessagesHeader
                sender={state.selected as SessionTestType}
                options={
                  <ChatbotOptions
                    session={state.selected as SessionTestType}
                    onDeleteSession={onDeleteSession}
                    onEditSession={onEditSession}
                  />
                }
              />
            }
            loader={isPending && <BouncingLoader />}
            messages={<MessageList messages={state.chats[state.selected.id]} />}
            input={
              <MessageInput
                onSubmit={(value, type) =>
                  sendMessage(state.selected as SessionTestType, value, type)
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
                      await sendMessage(session, value, TypeMessage.MESSAGE);
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
