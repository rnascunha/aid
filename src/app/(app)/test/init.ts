import { calculateBase64SizeInBytes, unicodeToBase64 } from "@/libs/base64";
import { BaseSender, ChatMessagesProps, TypeMessage } from "@/libs/chat/types";
import { generateUUID } from "@/libs/uuid";

export const sessions: BaseSender[] = [
  {
    id: generateUUID(),
    name: "Session 1",
  },
  {
    id: generateUUID(),
    name: "Mega session 2",
  },
];

export const chats: ChatMessagesProps = {
  [sessions[0].id]: [
    {
      id: generateUUID(),
      origin: "received",
      senderId: sessions[0].id,
      timestamp: Date.now() - 2000000,
      type: TypeMessage.ERROR,
      content: {
        name: "This is a **ERROR** message",
        text: "*The tale of the error*\n\nDo not make mistakes!",
      },
    },
    {
      id: generateUUID(),
      origin: "received",
      senderId: sessions[0].id,
      timestamp: Date.now() - 1500000,
      type: TypeMessage.WARNING,
      content: {
        name: "This is a **WARNING** message",
        text: "*The tale of a warning*\n\nYou are been adivised!",
      },
    },
    {
      id: generateUUID(),
      origin: "received",
      senderId: sessions[0].id,
      timestamp: Date.now() - 1300000,
      type: TypeMessage.SUCCESS,
      content: {
        name: "This is a **SUCCESS** message",
        text: "*The tale of the success*\n\nTo succeed, you must try!",
      },
    },
    {
      id: generateUUID(),
      origin: "received",
      senderId: sessions[0].id,
      timestamp: Date.now() - 1200000,
      type: TypeMessage.INFO,
      content: {
        name: "This is a **INFO** message",
        text: "*The tale of the information*\n\nInformation is a the key!",
      },
    },
    {
      id: generateUUID(),
      origin: "received",
      senderId: sessions[0].id,
      timestamp: Date.now() - 1000000,
      type: TypeMessage.MESSAGE,
      content: [
        {
          text: "This is a fake thought! But I have thought about it!",
          thought: true,
        },
        (() => {
          const data = unicodeToBase64(
            JSON.stringify({
              name: "file.json",
              descrition: "This is a fake file",
              data: [1, 1, 2, 3, 5, 8, 11],
            }),
          );
          const size = calculateBase64SizeInBytes(data);
          return {
            inlineData: {
              mimeType: "application/json",
              displayName: "file.json",
              data,
              size,
            },
          };
        })(),
        {
          text: "**This is a example**\n\n\nDo not cite the deep magic to me, witch. I was there when it was written",
        },
      ],
    },
  ],
  [sessions[1].id]: Array.from({ length: 1000 }).map((d, i) => ({
    id: generateUUID(),
    origin: "received",
    senderId: sessions[0].id,
    timestamp: Date.now() - (1000 - i) * 10000,
    type: TypeMessage.MESSAGE,
    content: [{
      text: `Message ${i}`,
    }],
  })),
};
