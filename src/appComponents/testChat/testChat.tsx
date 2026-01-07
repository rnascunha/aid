"use client";

import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatsPane } from "@/components/chat/chatsPane";
import { ChatList, EmptyChatList } from "@/components/chat/chatList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import { BouncingLoader } from "@/components/bouncingLoader";
import { ChatHeader } from "@/components/chat/chatHeader";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
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
import { onMessageSendHandler } from "@/libs/chat/functions";
import { MessagesHeader } from "@/components/chat/messagesHeader";
import { ChatbotOptions } from "./components/sessionOptions";
import { MessageInput } from "@/components/chat/input/messageInput";
import { InputOutput } from "@/components/chat/input/types";

interface ChatBotProps {
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
}: ChatBotProps) {
  const [sessions, setSessions] = useState<SessionType[]>(initSessions);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(
    null
  );
  const [chats, setChats] = useState<ChatMessagesProps>(initChats);
  const [isPending, startTransition] = useTransition();

  const onDeleteSession = async (session: SessionType) => {
    setSessions((prev) => prev.filter((ss) => ss.id !== session.id));
    if (session.id === selectedSession?.id) setSelectedSession(null);
    await onAddRemoveSession?.(session.id);
  };

  const onEditSession = async <K extends keyof SessionType>(
    session: SessionType,
    field: K,
    value: SessionType[K]
  ) => {
    const fSession = sessions.find((s) => s.id === session.id);
    if (!fSession) return;
    fSession[field] = value;
    setSessions((prev) => [...prev]);
    await onAddRemoveSession?.(fSession);
  };

  const onAddSession = async (name: string = "") => {
    const newSession = createNewSession(name);
    setSessions((prev) => [...prev, newSession]);
    setChats((prev) => ({
      ...prev,
      [newSession.id]: [],
    }));
    await onAddRemoveSession?.(newSession);
  };

  const onMessageHandler = async (
    messages: InputOutput | MessageContentStatus,
    type: TypeMessage
  ) => {
    if (type === TypeMessage.MESSAGE && !(messages as InputOutput).text.trim())
      return;

    const newMessage = onMessageSendHandler(
      messages,
      type,
      selectedSession!.id,
      setChats
    );

    await onMessage?.(newMessage, selectedSession!.id);
    if (newMessage.type !== TypeMessage.MESSAGE) return;

    startTransition(async () => {
      const response = await messageResponse(
        {
          message: messages.text,
          newId: newMessage.id,
          session: selectedSession as SessionType,
        },
        setChats
      );
      await onMessage?.(response, selectedSession!.id);
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
            sessions.length === 0 ? (
              <EmptyChatList addModelButton={<div></div>} />
            ) : (
              <ChatList
                senders={sessions}
                chats={chats}
                selectedSender={selectedSession}
                setSelectedSender={
                  setSelectedSession as Dispatch<
                    SetStateAction<BaseSender | null>
                  >
                }
              />
            )
          }
        />
      }
      MessagePane={
        !selectedSession ? (
          <EmptyMessagesPane />
        ) : (
          <MessagesPane
            header={
              <MessagesHeader
                sender={selectedSession}
                options={
                  <ChatbotOptions
                    session={selectedSession}
                    onDeleteSession={onDeleteSession}
                    onEditSession={onEditSession}
                  />
                }
              />
            }
            loader={isPending && <BouncingLoader />}
            messages={
              <MessageList
                messages={chats[selectedSession.id] as MessageProps[]}
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
