"use client";

import { getIpiFyIP } from "@/libs/apis/ipify";
import { initTools } from "@/libs/chat/models/data";
import { getProviders, getTools } from "@/libs/chat/storage/indexDB/general";
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

interface AIContext {
  providers: ProviderProps[];
  setProviders: Dispatch<SetStateAction<ProviderProps[]>>;
  openSettings: boolean;
  setOpenSettings: Dispatch<SetStateAction<boolean>>;
  tools: ToolsProps;
  setTools: Dispatch<SetStateAction<ToolsProps>>;
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
    getTools(),
  ]);

  setTools({ ...initTools, ip, ...(tools ?? {}) });
}

async function getUserProviders(
  setProviders: Dispatch<SetStateAction<ProviderProps[]>>
) {
  const ps = await getProviders();
  setProviders(ps);
}

export const aIContext = createContext<AIContext>(defaultAIContext);

export function AIContextProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<ProviderProps[]>(
    defaultAIContext.providers
  );
  const [openSettings, setOpenSettings] = useState(
    defaultAIContext.openSettings
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
      }}
    >
      {children}
    </aIContext.Provider>
  );
}
