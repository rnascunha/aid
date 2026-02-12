import { app_name } from "@/appComponents/chatbot/constants";
import { api_post, checkAuthenticatedUser } from "@/libs/adk/api";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const noAuth = await checkAuthenticatedUser();
  if (noAuth) return noAuth;
  return await api_post(req, app_name);
}
