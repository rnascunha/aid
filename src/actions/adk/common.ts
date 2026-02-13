"use server";

import * as adk from "@/libs/adk/base";
import {
  ADKException,
  DeleteSessionProps,
  GetSessionProps,
  UpdateSesionProps,
} from "@/libs/adk/types";
import { TypeMessage } from "@/libs/chat/types";

function throwResponse(error: Error) {
  if (error instanceof ADKException) {
    const response = error.json();
    return {
      type: TypeMessage.ERROR,
      content: {
        name: response.error,
        text: response.message,
      },
      raw: response,
    };
  }
  const err = error as Error;
  return {
    type: TypeMessage.ERROR,
    content: {
      name: err.name,
      text: err.message,
    },
    raw: JSON.stringify(err),
  };
}

function errorReturn(
  response: {
    ok: true;
    status: number;
    statusText: string;
    data: any;
  },
  title?: string,
) {
  return {
    type: TypeMessage.ERROR,
    content: {
      name: title || "Error",
      text: `[${response.status}] ${response.statusText}`,
    },
    raw: response.data,
  };
}

export async function updateSessionState(args: UpdateSesionProps) {
  try {
    const response = await adk.updateSession(args);
    if (!response.ok)
      return errorReturn(response, "Update Session State Error");
    return {
      type: TypeMessage.SUCCESS,
      content: {
        name: "Update State Success",
        text: `State session id ${args.session}`,
      },
      raw: response.data,
    };
  } catch (e) {
    return throwResponse(e as Error);
  }
}

export async function getSessionState(args: GetSessionProps) {
  try {
    const response = await adk.getSession(args);
    if (!response.ok) return errorReturn(response, "Get Session State Error");
    return {
      type: TypeMessage.SUCCESS,
      content: {
        name: "Get State Success",
        text: `State session id ${args.session}`,
      },
      raw: response.data,
    };
  } catch (e) {
    return throwResponse(e as Error);
  }
}

export async function deleteSession(args: DeleteSessionProps) {
  try {
    const response = await adk.deleteSession(args);
    if (!response.ok) return errorReturn(response, "Delete Session Error");
    return {
      type: TypeMessage.SUCCESS,
      content: {
        name: "Delete Session Success",
        text: `Deleted session id ${args.session}`,
      },
      raw: response,
    };
  } catch (e) {
    return throwResponse(e as Error);
  }
}
