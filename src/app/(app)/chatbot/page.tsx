"use client";

import ChatBot from "@/appComponents/chatbot/chatbot";
import {
  ChatMessagesChatbotProps,
  SessionType,
} from "@/appComponents/chatbot/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { basePath } from "@/constants";
import {
  getAllChatbotMessages,
  getAllSessions,
  onAddRemoveSession,
  onChatbotMessage,
} from "@/libs/chat/storage/indexDB/chatbot";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatbotPage() {
  const [dbData, setDbData] = useState<null | {
    sessions: SessionType[];
    chats: ChatMessagesChatbotProps;
  }>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    (async function getData() {
      const sessions = await getAllSessions();
      const chats = await getAllChatbotMessages(sessions);
      return { sessions, chats };
    })().then(({ sessions, chats }) => setDbData({ sessions, chats }));
  }, []);

  if (status === "loading") return <CenterSpinner />;
  if (status === "unauthenticated" || !session?.user) redirect(basePath);
  if (dbData === null) return <CenterSpinner />;

  return (
    <ChatBot
      sessions={dbData.sessions}
      user={session?.user!.email as string}
      chats={dbData.chats}
      onMessage={onChatbotMessage}
      onAddRemoveSession={onAddRemoveSession}
    />
  );
}
