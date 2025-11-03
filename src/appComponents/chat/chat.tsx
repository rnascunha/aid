"use client";

import { Chat } from "@/components/chat/chat";
import {
  deleteMessages,
  getAllMessages,
  getAllModels,
  getSettings,
  onAddRemoveModel,
  onMessage,
  updateSettings,
} from "@/libs/chatStorage";
import { useEffect, useState } from "react";
import { ChatMessagesProps, ModelProps } from "@/components/chat/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { ChatSettings } from "./types";
import { defaultSettings } from "./data";
// import { chats, models } from "./data";

export function ChatApp() {
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
      const chats = await getAllMessages(models);
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
      // models={models}
      // chats={chats}
      onMessage={onMessage}
      onDeleteMessages={deleteMessages}
      onAddRemoveModel={onAddRemoveModel}
      onSettingsChange={updateSettings}
    />
  );
}
