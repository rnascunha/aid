import ChatBot from "@/appComponents/chatbot/chatbot";
import crypto from "crypto";

function createRandomSessions() {
  return [
    {
      id: crypto.randomUUID(),
      name: "My first session",
    },
    {
      id: crypto.randomUUID(),
      name: "My second session",
    },
    {
      id: crypto.randomUUID(),
      name: "My third session",
    },
  ];
}

export default function ChatBotPage() {
  return <ChatBot sessions={createRandomSessions()} />;
}
