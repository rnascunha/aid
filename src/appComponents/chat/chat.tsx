import { Chat } from "@/components/chat/chat";
import { chats, providers } from "./data";

export function ChatApp() {
  return <Chat providers={providers} chats={chats} />;
}
