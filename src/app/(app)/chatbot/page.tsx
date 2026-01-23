"use client";

import ChatBot from "@/appComponents/chatbot/chatbot";
import { getChatbotData } from "@/appComponents/chatbot/functions";
import { ChatbotData } from "@/appComponents/chatbot/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { basePath } from "@/constants";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatbotStorageBase } from "@/libs/chat/storage/storageBase";

// import { chatbotStorage } from "@/libs/chat/storage/indexDB/store";
import { chatbotStorage } from "@/libs/chat/storage/mongodb/storageMongoDB";

export default function ChatbotPage() {
  const [dbData, setDbData] = useState<null | ChatbotData>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!chatbotStorage) return;
    getChatbotData({ storage: chatbotStorage as ChatbotStorageBase }).then(
      (data) => setDbData(data),
    );
  }, []);

  if (status === "loading") return <CenterSpinner />;
  if (status === "unauthenticated" || !session?.user) redirect(basePath);
  if (dbData === null) return <CenterSpinner />;

  return (
    <ChatBot
      sessions={dbData.sessions}
      user={session?.user!.email as string}
      chats={dbData.chats}
      storage={chatbotStorage as ChatbotStorageBase}
    />
  );
}
