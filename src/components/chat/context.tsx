"use client";

import { getIpiFyIP } from "@/libs/apis/ipify";
import { initTools } from "@/libs/chat/models/data";
import { ToolsProps } from "@/libs/chat/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { ProviderProps } from "../../libs/chat/models/types";
import { StorageGeneralBase } from "@/libs/chat/storage/storageBase";
import { useSession } from "next-auth/react";
import { StorageGeneralMongoDB } from "@/libs/chat/storage/mongodb/storageMongoDB";

// import { generalStorage } from "@/libs/chat/storage/indexDB/store";
// import { generalStorage } from "@/libs/chat/storage/mongodb/storageMongoDB";

interface AIContext {
  providers: ProviderProps[];
  setProviders: Dispatch<SetStateAction<ProviderProps[]>>;
  openSettings: boolean;
  setOpenSettings: Dispatch<SetStateAction<boolean>>;
  tools: ToolsProps;
  setTools: Dispatch<SetStateAction<ToolsProps>>;
  storage?: StorageGeneralBase;
}

const defaultAIContext: AIContext = {
  providers: [],
  setProviders: () => {},
  openSettings: false,
  setOpenSettings: () => {},
  tools: initTools,
  setTools: () => {},
};

async function getUserTools(
  setTools: Dispatch<SetStateAction<ToolsProps>>,
  storage?: StorageGeneralBase,
) {
  const [ip, tools] = await Promise.all([
    getIpiFyIP().catch(() => ""),
    storage?.getTools(),
  ]);

  setTools({ ...initTools, ip, ...(tools ?? {}) });
}

async function getUserProviders(
  setProviders: Dispatch<SetStateAction<ProviderProps[]>>,
  storage?: StorageGeneralBase,
) {
  const ps = await storage?.getProviders();
  if (!ps) return;
  setProviders(ps);
}

export const aIContext = createContext<AIContext>(defaultAIContext);

export function AIContextProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<ProviderProps[]>(
    defaultAIContext.providers,
  );
  const [openSettings, setOpenSettings] = useState(
    defaultAIContext.openSettings,
  );
  const [tools, setTools] = useState<ToolsProps>(initTools);
  const { data: session, status } = useSession();
  const storage = useRef<StorageGeneralBase | null>(null);

  useEffect(() => {
    if (status === "authenticated")
      storage.current = new StorageGeneralMongoDB(session.user!.email!);
    Promise.all([
      getUserProviders(setProviders, storage.current ?? undefined),
      getUserTools(setTools, storage.current ?? undefined),
      import("dexie-export-import"),
    ]);
  }, [status]);

  return (
    <aIContext.Provider
      value={{
        providers,
        setProviders,
        openSettings,
        setOpenSettings,
        tools,
        setTools,
        storage: storage.current as StorageGeneralBase,
      }}
    >
      {children}
    </aIContext.Provider>
  );
}
