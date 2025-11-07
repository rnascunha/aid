"use client";

import { providerMap } from "@/libs/chat/data";
import { getProviders } from "@/libs/chat/storage";
import { ProviderAuth, ProviderProps } from "@/libs/chat/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface AIContext {
  providers: Record<string, ProviderProps>;
  setProviders: Dispatch<SetStateAction<Record<string, ProviderProps>>>;
  openSettings: boolean;
  setOpenSettings: Dispatch<SetStateAction<boolean>>;
}

const defaultAIContext: AIContext = {
  providers: providerMap,
  setProviders: () => {},
  openSettings: false,
  setOpenSettings: () => {},
};

export const aIContext = createContext<AIContext>(defaultAIContext);

export function AIContextProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<Record<string, ProviderProps>>(
    defaultAIContext.providers
  );
  const [openSettings, setOpenSettings] = useState(
    defaultAIContext.openSettings
  );

  useEffect(() => {
    getProviders().then((ps) => {
      Object.values(ps).reduce((acc, { id, auth }) => {
        acc[id] = auth;
        setProviders((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            auth: {
              ...prev[id].auth,
              ...auth,
            },
          },
        }));
        return acc;
      }, {} as Record<string, ProviderAuth>);
    });
  }, []);

  return (
    <aIContext.Provider
      value={{
        providers,
        setProviders,
        openSettings,
        setOpenSettings,
      }}
    >
      {children}
    </aIContext.Provider>
  );
}
