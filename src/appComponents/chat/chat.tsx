import { Chat } from "@/components/chat/chat";
import { chats, models } from "./data";

export function ChatApp() {
  return <Chat models={models} chats={chats} />;
}
