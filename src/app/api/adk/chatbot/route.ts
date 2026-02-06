import { app_name } from "@/appComponents/chatbot/constants";
import { api_post } from "@/libs/adk/api";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return await api_post(req, app_name);
}
