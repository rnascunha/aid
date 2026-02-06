import { AgentTraveler } from "@/appComponents/agentTraveler/agentTraveler";

import { redirect } from "next/navigation";
import { basePath } from "@/constants";
import { auth } from "@/auth";
import { AgentTravelerPageMongoDB } from "./agentTravelerPages";

export default async function AgentTravelerPage() {
  const session = await auth();

  if (!session) return redirect(basePath);

  return <AgentTravelerPageMongoDB session={session} />;
}
