import Dexie, { Table } from "dexie";
import { TableMessages, TableModels, ToolsDB } from "./types";
import { ChatSettings } from "@/appComponents/chat/types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { ProviderProps } from "@/components/chat/model/types";

export const aISettings = new Dexie("AISettings") as Dexie & {
  // General
  providers: Table<ProviderProps, string>;
  tools: Table<ToolsDB, string>;
  // Chat
  chatMessages: TableMessages;
  chatModels: TableModels;
  chatSettings: Table<ChatSettings, string>;
  // Audio to Text
  audioToTextMessages: TableMessages;
  audioToTextModels: TableModels;
  audioToTextSettings: Table<AudioToTextSettings, string>;
};

aISettings.version(1).stores({
  // General
  providers: "id",
  tools: "",
  // Chat
  chatMessages: "[id+contactId], contactId",
  chatModels: "id, providerId",
  chatSettings: "",
  // Audio to Text
  audioToTextMessages: "[id+contactId], contactId",
  audioToTextModels: "id, providerId",
  audioToTextSettings: "",
});

aISettings.open();
