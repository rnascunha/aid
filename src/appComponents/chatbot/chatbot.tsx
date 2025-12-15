"use client";

import { Stack } from "@mui/material";

import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatsPane } from "@/components/chat/chatsPane";
import { EmptyChatList } from "@/components/chat/chatList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import { BouncingLoader } from "@/components/bouncingLoader";
import { ChatHeader } from "@/components/chat/chatHeader";
import { useState } from "react";
import { AddSession, SessionList } from "./components/sessionList";
import { SessionType } from "./types";
import { createNewSession } from "./functions";
import { MessagesHeader } from "./components/messageHeader";
import { MessageInput } from "@/components/chat/messageInput";

interface ChatBotProps {
  sessions: SessionType[];
}

export default function ChatBot({ sessions: initSessions }: ChatBotProps) {
  const [sessions, setSessions] = useState<SessionType[]>(initSessions);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(
    null
  );
  const isPending = false;

  const onDeleteSession = (session: SessionType) => {
    setSessions((prev) => prev.filter((ss) => ss.id !== session.id));
    if (session.id === selectedSession?.id) setSelectedSession(null);
  };

  const onEditSession = (
    session: SessionType,
    field: keyof SessionType,
    value: unknown
  ) => {
    setSessions((prev) => {
      const fSession = prev.find((s) => s.id === session.id);
      if (fSession) fSession[field] = value as string;
      return [...prev];
    });
  };

  const onAddSession = (name: string = "") => {
    const newSession = createNewSession(name);
    setSessions((prev) => [...prev, newSession]);
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
            messages={<Stack>This is a message pane</Stack>}
            input={<MessageInput onSubmit={() => {}} isPending={isPending} />}
          />
        )
      }
    />
  );
}
