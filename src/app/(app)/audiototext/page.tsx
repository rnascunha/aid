"use client";

import { AudioToText } from "@/appComponents/audioToText/audioToText";
import { initAudioSettings, models } from "@/appComponents/audioToText/data";
import {
  deleteAudioToTextMessages,
  getAllAudioToTextMessages,
  getSettings,
  onAudioToTextMessage,
  updateSettings,
} from "@/appComponents/audioToText/storage";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { ChatMessagesProps } from "@/libs/chat/types";
import { useEffect, useState } from "react";

export default function AudioToTextPage() {
  const [dbData, setDbData] = useState<null | {
    chats: ChatMessagesProps;
    settings?: AudioToTextSettings;
  }>(null);

  useEffect(() => {
    async function getData() {
      const [settings, chats] = await Promise.all([
        getSettings(),
        getAllAudioToTextMessages(models),
      ]);
      return { chats, settings };
    }
    getData().then((d) => setDbData(d));
  }, []);

  return dbData === null ? (
    <CenterSpinner />
  ) : (
    <AudioToText
      models={models}
      chats={dbData.chats}
      settings={dbData.settings ?? initAudioSettings}
      onMessage={onAudioToTextMessage}
      onDeleteMessages={deleteAudioToTextMessages}
      onSettingsChange={updateSettings}
    />
  );
}
