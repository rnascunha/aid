"use client";

import { Chat } from "@/appComponents/chat/chat";
import { getChatData } from "@/appComponents/chat/functions";
import { ChatData } from "@/appComponents/chat/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { StorageChatMongoDB } from "@/libs/chat/storage/mongodb/storageMongoDB";
import { ChatStorageBase } from "@/libs/chat/storage/storageBase";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";

export function ChatPageMongoDB({ session }: { session: Session }) {
  const [dbData, setDbData] = useState<null | ChatData>(null);
  const storage = useRef<ChatStorageBase>(
    new StorageChatMongoDB(session.user!.email!),
  );

  useEffect(() => {
    getChatData({ storage: storage.current }).then((data) => setDbData(data));
  }, []);

  if (dbData === null) return <CenterSpinner />;

  return (
    <Chat
      models={dbData.models}
      chats={dbData.chats}
      settings={dbData.settings}
      storage={storage.current as ChatStorageBase}
    />
  );
}
