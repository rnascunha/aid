import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Audio To Text",
  openGraph: {
    title: "Audio To Text",
  },
  twitter: {
    title: "Audio To Text",
  },
};

export default function ChatLayout({ children }: { children: ReactNode }) {
  return children;
}
