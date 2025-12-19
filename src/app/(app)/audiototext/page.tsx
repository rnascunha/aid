"use client";

import { AudioToText } from "@/appComponents/audioToText/audioToText";
import { initAudioSettings } from "@/appComponents/audioToText/data";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { ModelProps } from "@/libs/chat/models/types";
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
import { useEffect, useState } from "react";
import { ChatMessagesProps } from "@/libs/chat/types";

interface DataDB {
  models: ModelProps[];
  chats: ChatMessagesProps;
  settings?: AudioToTextSettings;
}

export default function AudioToTextPage() {
  const [dbData, setDbData] = useState<null | DataDB>(null);

  useEffect(() => {
    async function getData() {
      const [settings, models] = await Promise.all([
        getAudioToTextSettings(),
        getAllAudioToTextModels(),
      ]);
      const chats = await getAllAudioToTextMessages(models as ModelProps[]);
      return { chats, settings, models };
    }
    getData().then((d) => setDbData(d as DataDB));
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
