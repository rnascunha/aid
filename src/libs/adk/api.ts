import { auth } from "@/auth";
import { fetchQuery, initiateSession } from "@/libs/adk/base";
import { NextRequest, NextResponse } from "next/server";

export async function api_post(req: NextRequest, app_name: string) {
  const { user, session, parts, streaming } = await req.json();

  const response = await fetchQuery({
    app_name,
    user,
    session,
    parts,
    streaming,
    sse: true,
  });

  if (response.status === 200)
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });

  // 404 = Session not intiated
  if (response.status === 404) {
    const initResponse = await initiateSession({
      app_name,
      user,
      session,
    });

    if (![200, 409].includes(initResponse.status))
      return new Response(initResponse.data, {
        status: initResponse.status,
        statusText: initResponse.statusText,
      });
  }

  const response2 = await fetchQuery({
    app_name,
    user,
    session,
    parts,
    streaming,
    sse: true,
  });

  if (response2.status === 200)
    return new Response(response2.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });

  return response2;
}

export async function checkAuthenticatedUser() {
  const user = !!(await auth())?.user;
  if (!user) {
    return NextResponse.json(
      {
        error: "User not authenticated",
      },
      { status: 401 },
    );
  }
}
