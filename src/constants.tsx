import { ReactNode } from "react";

import ChatIcon from "@mui/icons-material/Chat";
import MicIcon from '@mui/icons-material/Mic';

export const restrictedPath = "/";
export const loginPath = "/login";

export const userListAllowed = new Set(["rnascunha@gmail.com"]);

export interface Section {
  id: string;
  name: string;
  icon: ReactNode;
  path?: string;
}

export const defaultPageSize = 50;

export const basePath = "";

export const sections: Section[] = [
  {
    id: "chat",
    name: "Chat",
    icon: <ChatIcon />,
    path: `${basePath}/chat`,
  },
  {
    id: "audiototext",
    name: "Audio To Text",
    icon: <MicIcon />,
    path: `${basePath}/audiototext`,
  },
];

export const sectionsMap = sections.reduce<Map<string, Section>>((acc, val) => {
  acc.set(val.id, val);
  return acc;
}, new Map<string, Section>());
