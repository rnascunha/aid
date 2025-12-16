"use client";

import { AudioToText } from "@/appComponents/audioToText/audioToText";
import { initAudioSettings } from "@/appComponents/audioToText/data";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import {
  ChatMessagesModelProps,
  ModelProps,
} from "@/components/chat/model/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import {
  deleteAudioToTextMessages,
  getAllAudioToTextMessages,
  getAllAudioToTextModels,
  getAudioToTextSettings,
  onAddAudioToTextRemoveModel,
  onAudioToTextMessage,
  updateAudioToTextSettings,
} from "@/libs/chat/storage/indexDB/audioToText";
// import { ChatMessagesProps, ModelProps } from "@/libs/chat/types";
import { useEffect, useState } from "react";

export default function AudioToTextPage() {
  const [dbData, setDbData] = useState<null | {
    models: ModelProps[];
    chats: ChatMessagesModelProps;
    settings?: AudioToTextSettings;
  }>(null);

  useEffect(() => {
    async function getData() {
      const [settings, models] = await Promise.all([
        getAudioToTextSettings(),
        getAllAudioToTextModels(),
      ]);
      const chats = await getAllAudioToTextMessages(models);
      return { chats, settings, models };
    }
    getData().then((d) => setDbData(d));
  }, []);

  return dbData === null ? (
    <CenterSpinner />
  ) : (
    <AudioToText
      models={dbData.models}
      chats={dbData.chats}
      settings={dbData.settings ?? initAudioSettings}
      onMessage={onAudioToTextMessage}
      onDeleteMessages={deleteAudioToTextMessages}
      onSettingsChange={updateAudioToTextSettings}
      onAddRemoveModel={onAddAudioToTextRemoveModel}
    />
  );
}
