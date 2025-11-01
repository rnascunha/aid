"use client";

import { Chat } from "@/components/chat/chat";
import { chats, models } from "./data";
import { deleteMessages, getAllMessages, onMessage } from "@/libs/chatStorage";
import { useEffect, useState } from "react";
import { ChatMessagesProps } from "@/components/chat/types";
import CenterSpinner from "@/components/spinner/centerSpinner";

export function ChatApp() {
  const [mount, setMount] = useState<null | ChatMessagesProps>(null);

  useEffect(() => {
    getAllMessages(models)
      .then((f) => {
        setMount(f);
        console.log(f);
      })
      .catch(() => setMount(chats));
  }, []);

  return mount === null ? (
    <CenterSpinner />
  ) : (
    <Chat
      models={models}
      chats={mount}
      onMessage={onMessage}
      onDelete={deleteMessages}
    />
  );
}
