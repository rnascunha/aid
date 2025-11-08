import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { StaticAvatar } from "./staticAvatar";
import { MessageProps } from "../../libs/chat/types";
import { MessageBubble } from "./messageBubble";
import { useEffect, useRef, useState } from "react";
import { providerMap } from "@/libs/chat/data";
import JSONOutput from "../JSONOutput";

interface MessageListProps {
  messages: MessageProps[];
}

function MessageDetail({ message }: { message: MessageProps }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sender, attachment, ...rest } = message;
  const msg =
    "error" in rest
      ? rest
      : {
          ...rest,
          attachment: attachment
            ? {
                name: attachment.name,
                size: attachment.size,
                type: attachment.type,
              }
            : null,
        };
  return <JSONOutput src={msg} name={null} />;
}

function MessageDetailDialog({
  message,
  onClose,
}: {
  message: MessageProps | null;
  onClose: () => void;
}) {
  return (
    <Dialog
      onClose={onClose}
      open={message !== null}
      aria-hidden="false"
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px",
            // height: "450px",
            maxHeight: "80%",
          },
        },
      }}
    >
      <DialogTitle>Message Details</DialogTitle>
      <DialogContent>
        {message && <MessageDetail message={message} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export function MessageList({ messages }: MessageListProps) {
  const el = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<MessageProps | null>(null);

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
                <StaticAvatar
                  src={providerMap[message.sender.providerId].logo}
                  alt={message.sender.name}
                />
              )}
              <MessageBubble
                variant={isYou ? "sent" : "received"}
                message={message}
                onClick={() => setMessage(message)}
              />
            </Stack>
          );
        })}
      </Stack>
      <MessageDetailDialog message={message} onClose={() => setMessage(null)} />
    </Box>
  );
}
