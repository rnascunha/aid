"use client";

import { AgentTraveler } from "@/appComponents/agentTraveler/agentTraveler";
import { getAgentTravelerData } from "@/appComponents/agentTraveler/functions";
import { AgentTravelerData } from "@/appComponents/agentTraveler/types";
import CenterSpinner from "@/components/spinner/centerSpinner";
import { StorageAgentTravelerMongoDB } from "@/libs/chat/storage/mongodb/storageMongoDB";
import { ChatbotStorageBase } from "@/libs/chat/storage/storageBase";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";

export function AgentTravelerPageMongoDB({ session }: { session: Session }) {
  const [dbData, setDbData] = useState<null | AgentTravelerData>(null);
  const storage = useRef<StorageAgentTravelerMongoDB>(
    new StorageAgentTravelerMongoDB(session.user!.email!),
  );

  useEffect(() => {
    getAgentTravelerData({ storage: storage.current }).then((data) =>
      setDbData(data),
    );
  }, []);

  if (dbData === null) return <CenterSpinner />;

  return (
    <AgentTraveler
      sessions={dbData.sessions}
      chats={dbData.chats}
      storage={storage.current as ChatbotStorageBase}
      user={session.user!.email!}
    />
  );
}
