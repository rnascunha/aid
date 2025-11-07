import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Chat",
  openGraph: {
    title: "Chat",
  },
  twitter: {
    title: "Chat",
  },
};

export default function ChatLayout({ children }: { children: ReactNode }) {
  return children;
}
