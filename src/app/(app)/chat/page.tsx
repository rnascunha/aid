"use client";

import { useEffect, useState } from "react";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { Chat } from "@/appComponents/chat/chat";
import { chatStorage } from "@/libs/chat/storage/indexDB/store";
import { ChatData } from "@/appComponents/chat/types";
import { getChatData } from "@/appComponents/chat/functions";
import { ChatStorageBase } from "@/libs/chat/storage/storageBase";

export default function ChatPage() {
  const [dbData, setDbData] = useState<null | ChatData>(null);

  useEffect(() => {
    getChatData({ storage: chatStorage as ChatStorageBase }).then((data) =>
      setDbData(data),
    );
  }, []);

  return dbData === null ? (
    <CenterSpinner />
  ) : (
    <Chat
      models={dbData.models}
      chats={dbData.chats}
      settings={dbData.settings}
      storage={chatStorage as ChatStorageBase}
    />
  );
}
