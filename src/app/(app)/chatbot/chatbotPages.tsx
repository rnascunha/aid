"use client";

import { Chatbot } from "@/appComponents/chatbot/chatbot";
import { getChatbotData } from "@/appComponents/chatbot/functions";
import { ChatbotData } from "@/appComponents/chatbot/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { StorageChatbotMongoDB } from "@/libs/chat/storage/mongodb/storageMongoDB";
import { ChatbotStorageBase } from "@/libs/chat/storage/storageBase";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";

export function ChatbotPageMongoDB({ session }: { session: Session }) {
  const [dbData, setDbData] = useState<null | ChatbotData>(null);
  const storage = useRef<ChatbotStorageBase>(
    new StorageChatbotMongoDB(session.user!.email!),
  );

  useEffect(() => {
    getChatbotData({ storage: storage.current }).then((data) =>
      setDbData(data),
    );
  }, []);

  if (dbData === null) return <CenterSpinner />;

  return (
    <Chatbot
      sessions={dbData.sessions}
      chats={dbData.chats}
      storage={storage.current as ChatbotStorageBase}
      user={session.user!.email!}
    />
  );
}
