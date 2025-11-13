"use client";

import { AudioToText } from "@/appComponents/audioToText/audioToText";
import { initAudioSettings } from "@/appComponents/audioToText/data";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import {
  deleteAudioToTextMessages,
  getAllAudioToTextMessages,
  getAudioToTextSettings,
  onAudioToTextMessage,
  updateAudioToTextSettings,
} from "@/libs/chat/storage/indexDB/audioToText";
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
        getAudioToTextSettings(),
        getAllAudioToTextMessages([]),
      ]);
      return { chats, settings };
    }
    getData().then((d) => setDbData(d));
  }, []);

  return dbData === null ? (
    <CenterSpinner />
  ) : (
    <AudioToText
      models={[]}
      chats={dbData.chats}
      settings={dbData.settings ?? initAudioSettings}
      onMessage={onAudioToTextMessage}
      onDeleteMessages={deleteAudioToTextMessages}
      onSettingsChange={updateAudioToTextSettings}
    />
  );
}
