import { agentTravelerAddMessage } from "@/actions/mongodb";
import { app_name } from "@/appComponents/agentTraveler/constants";
import { api_post, checkAuthenticatedUser } from "@/libs/adk/api";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const noAuth = await checkAuthenticatedUser();
  if (noAuth) return noAuth;
  return await api_post(req, app_name);
}

export async function PUT(req: NextRequest) {
  const noAuth = await checkAuthenticatedUser();
  if (noAuth) return noAuth;
  try {
    const { userId, messages } = await req.json();
    await agentTravelerAddMessage(messages, userId);
    return new Response(null, {
      status: 200,
      statusText: "Added data to database",
    });
  } catch (e) {
    return new Response(null, {
      status: 500,
      statusText: "Internal Error",
    });
  }
}
