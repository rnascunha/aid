"use server";

import * as adk from "@/libs/adk/base";
import {
  ADKException,
  DeleteSessionProps,
  GetSessionProps,
  UpdateSesionProps,
} from "@/libs/adk/types";
import { TypeMessage } from "@/libs/chat/types";

export async function updateSession(args: UpdateSesionProps) {
  try {
    const data = await adk.updateSession(args);
    console.log(data);
    return data;
  } catch (e) {
    if (e instanceof ADKException) {
      const errorResponse = e.json();
      return {
        type: TypeMessage.ERROR,
        content: {
          name: errorResponse.error,
          text: errorResponse.message,
        },
        raw: errorResponse,
      };
    }
    const error = e as Error;
    return {
      type: TypeMessage.ERROR,
      content: {
        name: error.name,
        text: error.message,
      },
      raw: JSON.stringify(error),
    };
  }
}

export async function getSession(args: GetSessionProps) {
  try {
    const data = await adk.getSession(args);
    console.log(data);
    return data;
  } catch (e) {
    if (e instanceof ADKException) {
      const errorResponse = e.json();
      return {
        type: TypeMessage.ERROR,
        content: {
          name: errorResponse.error,
          text: errorResponse.message,
        },
        raw: errorResponse,
      };
    }
    const error = e as Error;
    return {
      type: TypeMessage.ERROR,
      content: {
        name: error.name,
        text: error.message,
      },
      raw: JSON.stringify(error),
    };
  }
}

export async function deleteSession(args: DeleteSessionProps) {
  try {
    const response = await adk.deleteSession(args);
    console.log(response);
    if (!response.ok) {
      return {
        type: TypeMessage.ERROR,
        content: {
          name: "Delete Session Error",
          text: response.statusText,
        },
        raw: response,
      };
    }
    return {
      type: TypeMessage.SUCCESS,
      content: {
        name: "Delete Session Success",
        text: `Deleted session id ${args.session}`,
      },
      raw: response,
    };
  } catch (e) {
    if (e instanceof ADKException) {
      const errorResponse = e.json();
      return {
        type: TypeMessage.ERROR,
        content: {
          name: errorResponse.error,
          text: errorResponse.message,
        },
        raw: errorResponse,
      };
    }
    const error = e as Error;
    return {
      type: TypeMessage.ERROR,
      content: {
        name: error.name,
        text: error.message,
      },
      raw: JSON.stringify(error),
    };
  }
}
