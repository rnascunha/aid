"use client";

import { AudioToText } from "@/appComponents/audioToText/audioToText";
import { getAudioToTextData } from "@/appComponents/audioToText/functions";
import { AudioToTextData } from "@/appComponents/audioToText/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { audioToTextStorage } from "@/libs/chat/storage/indexDB/store";
import { AudioToTextStorageBase } from "@/libs/chat/storage/storageBase";
import { useEffect, useState } from "react";

export default function AudioToTextPage() {
  const [dbData, setDbData] = useState<null | AudioToTextData>(null);

  useEffect(() => {
    getAudioToTextData({
      storage: audioToTextStorage as AudioToTextStorageBase,
    }).then((d) => setDbData(d));
  }, []);

  return dbData === null ? (
    <CenterSpinner />
  ) : (
    <AudioToText
      models={dbData.models}
      chats={dbData.chats}
      settings={dbData.settings}
      storage={audioToTextStorage as AudioToTextStorageBase}
    />
  );
}
