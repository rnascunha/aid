"use server";

import { MessageContentStatus, TypeMessage } from "@/libs/chat/types";
import * as adk from "@/libs/adk/base";
import { ADKException, Part, SendQueryProps } from "../libs/adk/types";

interface ChatbotResponse {
  type: TypeMessage;
  content: MessageContentStatus | Part[];
  raw: object;
}

function errorResponse(message: Awaited<ReturnType<typeof adk.sendQuery>>) {
  return {
    type: TypeMessage.ERROR,
    content: {
      name: message.statusText,
      text: message.data.detail,
    },
    raw: message,
  };
}

function mergeContentResponses(
  message: Awaited<ReturnType<typeof adk.sendQuery>>
) {
  return message.data.reduce(
    (acc: Part[], c: { content: { parts: Part[] } }) => {
      acc.push(...c.content!.parts);
      return acc;
    },
    [] as Part[]
  );
}

function messageResponse(message: Awaited<ReturnType<typeof adk.sendQuery>>) {
  return {
    type: TypeMessage.MESSAGE,
    content: mergeContentResponses(message),
    raw: message,
  };
}

export async function sendQuery({
  app_name,
  user,
  session,
  url,
  parts,
}: SendQueryProps): Promise<ChatbotResponse> {
  try {
    const response = await adk.sendQuery({
      app_name,
      user,
      session,
      parts,
      url,
    });

    if (response.status !== 404)
      return response.status === 200
        ? messageResponse(response)
        : errorResponse(response);

    const initResponse = await adk.initiateSession({
      app_name,
      user,
      session,
      url,
    });

    if (![200, 409].includes(initResponse.status))
      return {
        type: TypeMessage.ERROR,
        content: {
          name: "Initiate Session Error",
          text: "Error trying to initiate session",
        },
        raw: initResponse,
      };

    const response2 = await adk.sendQuery({
      app_name,
      user,
      session,
      parts,
      url,
    });

    return response2.status === 200
      ? messageResponse(response2)
      : errorResponse(response2);
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
      raw: error,
    };
  }
}
