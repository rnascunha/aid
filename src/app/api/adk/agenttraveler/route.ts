import {
  agentTravelerAddMessage,
  agentTravelerAddSender,
} from "@/actions/mongodb";
import { app_name } from "@/appComponents/agentTraveler/constants";
import {
  postFetchRequestStreamingMessage,
  checkAuthenticatedUser,
  getSessionStateAPI,
} from "@/libs/adk/api";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const noAuth = await checkAuthenticatedUser();
  if (noAuth) return noAuth;
  return await postFetchRequestStreamingMessage(req, app_name);
}

/**
 * Add to database MongoDB
 */
export async function PUT(req: NextRequest) {
  const noAuth = await checkAuthenticatedUser();
  if (noAuth) return noAuth;
  try {
    const { userId, messages, sender } = await req.json();
    await Promise.all([
      messages ? agentTravelerAddMessage(messages, userId) : undefined,
      sender ? agentTravelerAddSender(sender, userId) : undefined,
    ]);
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

/**
 * Get state
 */
export async function GET(req: NextRequest) {
  const noAuth = await checkAuthenticatedUser();
  if (noAuth) return noAuth;
  return await getSessionStateAPI(req, app_name);
}
