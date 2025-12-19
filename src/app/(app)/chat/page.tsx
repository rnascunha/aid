"use client";

import { useEffect, useState } from "react";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { ChatSettings } from "@/appComponents/chat/types";
import { defaultSettings } from "@/appComponents/chat/data";
import { Chat } from "@/appComponents/chat/chat";
import {
  deleteChatMessages,
  getAllChatMessages,
  getAllChatModels,
  getChatSettings,
  onAddRemoveChatModel,
  onChatMessage,
  updateChatSettings,
} from "@/libs/chat/storage/indexDB/chat";
import { ModelProps } from "@/libs/chat/models/types";
import { ChatMessagesProps } from "@/libs/chat/types";

interface DataDB {
  chats: ChatMessagesProps;
  models: ModelProps[];
  settings?: ChatSettings;
}

export default function ChatPage() {
  const [dbData, setDbData] = useState<null | DataDB>(null);

  useEffect(() => {
    async function getData() {
      const [models, settings] = await Promise.all([
        getAllChatModels(),
        getChatSettings(),
      ]);
      const chats = await getAllChatMessages(models as ModelProps[]);
      return { models, chats, settings };
    }
    getData().then((d) => setDbData(d as DataDB));
  }, []);

  return dbData === null ? (
    <CenterSpinner />
  ) : (
    <Chat
      models={dbData.models}
      chats={dbData.chats}
      settings={dbData.settings ?? defaultSettings}
      onMessage={onChatMessage}
      onDeleteMessages={deleteChatMessages}
      onAddRemoveModel={onAddRemoveChatModel}
      onSettingsChange={updateChatSettings}
    />
  );
}
