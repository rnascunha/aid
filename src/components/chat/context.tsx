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
  useState,
} from "react";
import { ProviderProps } from "../../libs/chat/models/types";
import { StorageGeneralBase } from "@/libs/chat/storage/storageBase";
import { generalStorage } from "@/libs/chat/storage/indexDB/store";

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

async function getUserTools(setTools: Dispatch<SetStateAction<ToolsProps>>) {
  const [ip, tools] = await Promise.all([
    getIpiFyIP().catch(() => ""),
    generalStorage?.getTools(),
  ]);

  setTools({ ...initTools, ip, ...(tools ?? {}) });
}

async function getUserProviders(
  setProviders: Dispatch<SetStateAction<ProviderProps[]>>,
) {
  const ps = await generalStorage?.getProviders();
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

  useEffect(() => {
    Promise.all([
      getUserProviders(setProviders),
      getUserTools(setTools),
      import("dexie-export-import"),
    ]);
  }, []);

  return (
    <aIContext.Provider
      value={{
        providers,
        setProviders,
        openSettings,
        setOpenSettings,
        tools,
        setTools,
        storage: generalStorage as StorageGeneralBase,
      }}
    >
      {children}
    </aIContext.Provider>
  );
}
