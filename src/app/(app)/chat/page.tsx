"use client";

import {
  onChatMessage,
  deleteChatMessages,
  getAllChatMessages,
  getAllModels,
  getSettings,
  onAddRemoveModel,
  updateSettings,
} from "@/appComponents/chat/storage";
import { useEffect, useState } from "react";
import { ChatMessagesProps, ModelProps } from "@/libs/chat/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { ChatSettings } from "@/appComponents/chat/types";
import { defaultSettings } from "@/appComponents/chat/data";
import { Chat } from "@/appComponents/chat/chat";

export default function ChatPage() {
  const [dbData, setDbData] = useState<null | {
    chats: ChatMessagesProps;
    models: ModelProps[];
    settings?: ChatSettings;
  }>(null);

  useEffect(() => {
    async function getData() {
      const [models, settings] = await Promise.all([
        getAllModels(),
        getSettings(),
      ]);
      const chats = await getAllChatMessages(models);
      return { models, chats, settings };
    }
    getData().then((d) => setDbData(d));
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
      onAddRemoveModel={onAddRemoveModel}
      onSettingsChange={updateSettings}
    />
  );
}
