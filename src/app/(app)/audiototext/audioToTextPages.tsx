"use client";

import { AudioToText } from "@/appComponents/audioToText/audioToText";
import { getAudioToTextData } from "@/appComponents/audioToText/functions";
import { AudioToTextData } from "@/appComponents/audioToText/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { StorageAudioToTextMongoDB } from "@/libs/chat/storage/mongodb/storageMongoDB";
import { AudioToTextStorageBase } from "@/libs/chat/storage/storageBase";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";

export function AudioToTextPageMongoDB({ session }: { session: Session }) {
  const [dbData, setDbData] = useState<null | AudioToTextData>(null);
  const storage = useRef<AudioToTextStorageBase>(
    new StorageAudioToTextMongoDB(session.user!.email!),
  );

  useEffect(() => {
    getAudioToTextData({ storage: storage.current }).then((data) =>
      setDbData(data),
    );
  }, []);

  if (dbData === null) return <CenterSpinner />;

  return (
    <AudioToText
      models={dbData.models}
      chats={dbData.chats}
      settings={dbData.settings}
      storage={storage.current as AudioToTextStorageBase}
    />
  );
}
