import TestChat from "@/appComponents/testChat/testChat";
import { auth } from "@/auth";

export default async function TestChatPage() {
  const user = await auth();
  return <TestChat sessions={[]} chats={{}} user={user?.user?.name ?? "guest"} />;
}
