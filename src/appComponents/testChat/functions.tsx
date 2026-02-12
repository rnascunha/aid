import { SessionTestType } from "./types";
import { generateUUID } from "@/libs/uuid";
import { MessageProps, PartInlineData, TypeMessage } from "@/libs/chat/types";
import { delay } from "@/libs/time";
import { calculateBase64SizeInBytes, unicodeToBase64 } from "@/libs/base64";

export function createNewSession(name: string = ""): SessionTestType {
  return {
    name: name || `Session-${Math.floor(Math.random() * 100)}`,
    id: generateUUID(),
  };
}

function createInlineData(
  session: SessionTestType,
  message: string,
): { inlineData: PartInlineData } {
  const base64 = unicodeToBase64(
    JSON.stringify({
      session,
      message,
    }),
  );
  return {
    inlineData: {
      mimeType: "application/json",
      displayName: "file.json",
      data: base64,
      size: calculateBase64SizeInBytes(base64),
    },
  };
}

async function getFakeData(
  newId: string,
  session: SessionTestType,
  message: string,
): Promise<MessageProps[]> {
  const delayMs = 5000 + Math.floor(Math.random() * 100);
  await delay(delayMs);
  return [
    {
      id: `${newId}:r`,
      senderId: session.id,
      timestamp: Date.now(),
      origin: "received",
      type: TypeMessage.MESSAGE,
      content: [
        {
          text: `This is a fake message. Fake replaying`,
          thought: true,
        },
        {
          text: `The delay was of ${delayMs} ms`,
          thought: true,
        },
        /file/i.test(message) ? createInlineData(session, message) : undefined,
        {
          text: `**Replaying:**\n\n${message}`,
        },
      ].filter((f) => !!f),
    },
  ];
}

export async function messageResponse({
  message,
  newId,
  session,
}: {
  message: string;
  newId: string;
  session: SessionTestType;
}) {
  const response = await getFakeData(newId, session, message);
  return response;
}
