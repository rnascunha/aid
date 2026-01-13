import TestChat from "@/appComponents/testChat/testChat";
import { auth } from "@/auth";
import { chats, sessions } from "./init";

export default async function TestChatPage() {
  const user = await auth();
  return (
    <TestChat
      sessions={sessions}
      chats={chats}
      user={user?.user?.name ?? "guest"}
    />
  );
}
