import { redirect } from "next/navigation";
import { basePath } from "@/constants";
import { auth } from "@/auth";
import { AudioToTextPageMongoDB } from "./audioToTextPages";

export default async function ChatPage() {
  const session = await auth();

  if (!session) return redirect(basePath);

  return <AudioToTextPageMongoDB session={session} />;
}
