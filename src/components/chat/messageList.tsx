import { Box, Stack } from "@mui/material";
import AvatarWithStatus from "./avatarWithStatus";
import { MessageProps } from "./types";
import { MessageBubble } from "./messageBubble";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: MessageProps[];
}

export function MessageList({ messages }: MessageListProps) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elem = el.current;
    if (!elem) return;
    setTimeout(() => {
      elem.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 300);
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        px: 2,
        py: 3,
        overflowY: "auto",
        position: "relative",
      }}
    >
      <Stack
        spacing={2}
        ref={el}
        sx={{
          justifyContent: "flex-end",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          p: 0.5,
          overflowX: "hidden",
        }}
      >
        {messages.map((message: MessageProps, index: number) => {
          const isYou = message.sender === "You";
          return (
            <Stack
              key={index}
              direction="row"
              spacing={2}
              sx={{ flexDirection: isYou ? "row-reverse" : "row" }}
            >
              {message.sender !== "You" && (
                <AvatarWithStatus
                  online={message.sender.online}
                  src={message.sender.logo}
                  alt={message.sender.name}
                />
              )}
              <MessageBubble
                variant={isYou ? "sent" : "received"}
                message={message}
              />
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
