import { app_name } from "@/appComponents/chatbot/constants";
import {
  postFetchRequestStreamingMessage,
  checkAuthenticatedUser,
} from "@/libs/adk/api";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const noAuth = await checkAuthenticatedUser();
  if (noAuth) return noAuth;
  return await postFetchRequestStreamingMessage(req, app_name);
}
