"use client";

import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatsPane } from "@/components/chat/chatsPane";
import { EmptyChatList } from "@/components/chat/model/chatList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import { BouncingLoader } from "@/components/bouncingLoader";
import { ChatHeader } from "@/components/chat/chatHeader";
import { useState, useTransition } from "react";
import { AddSession, SessionList } from "./components/sessionList";
import {
  ChatMessagesChatbotProps,
  MessageChatbotProps,
  SessionType,
} from "./types";
import { createNewSession, messageResponse, messageSubmit } from "./functions";
import { MessagesHeader } from "./components/messageHeader";
import { MessageInput } from "@/components/chat/messageInput";
import { MessageList } from "@/components/chat/messageList";
import { generateUUID } from "@/libs/uuid";

interface ChatBotProps {
  sessions: SessionType[];
  chats: ChatMessagesChatbotProps;
  user: string;
  onMessage?: (
    message: MessageChatbotProps,
    contactId: string
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
  const [sessions, setSessions] = useState<SessionType[]>(initSessions);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(
    null
  );
  const [chats, setChats] = useState<ChatMessagesChatbotProps>(initChats);
  const [isPending, startTransition] = useTransition()

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

  const onAddSession = (name: string = "") => {
    const newSession = createNewSession(name);
    setSessions((prev) => [...prev, newSession]);
    setChats((prev) => ({
      ...prev,
      [newSession.id]: [],
    }));
  };

  const onMessageHandler = async (message: string) => {
    const newId = generateUUID();
    const newMessage = messageSubmit(
      { message, newId, session: selectedSession as SessionType },
      setChats
    );
    await onMessage?.(newMessage, selectedSession!.id);
    startTransition(async () => {
      const response = await messageResponse(
        {
          message,
          user,
          newId,
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
              <SessionList
                sessions={sessions}
                selectedSession={selectedSession}
                setSelectedSession={setSelectedSession}
                onDeleteSession={onDeleteSession}
                onEditSession={onEditSession}
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
            header={<MessagesHeader session={selectedSession} />}
            loader={isPending && <BouncingLoader />}
            messages={
              <MessageList
                messages={chats[selectedSession.id] as MessageChatbotProps[]}
              />
            }
            input={
              <MessageInput
                onSubmit={(value) => onMessageHandler(value)}
                isPending={isPending}
              />
            }
          />
        )
      }
    />
  );
}
