import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { BaseSender, MessageProps } from "../../libs/chat/types";
import { MessageBubble } from "./messageBubble";
import { ReactNode, useEffect, useRef, useState } from "react";
import JSONOutput from "../JSONOutput";

function MessageDetail<T extends BaseSender>({
  message,
}: {
  message: MessageProps<T>;
}) {
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

function MessageDetailDialog<T extends BaseSender>({
  message,
  onClose,
}: {
  message: MessageProps<T> | null;
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
            maxWidth: "600px",
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

interface MessageListProps<T extends BaseSender> {
  messages: MessageProps<T>[];
  avatar?: ReactNode;
}

export function MessageList<T extends BaseSender>({
  messages,
  avatar,
}: MessageListProps<T>) {
  const el = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<MessageProps<T> | null>(null);

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
        {messages.map((message: MessageProps<T>, index: number) => {
          const isYou = message.sender === "You";
          return (
            <Stack
              key={index}
              direction="row"
              spacing={2}
              sx={{ flexDirection: isYou ? "row-reverse" : "row" }}
            >
              {message.sender !== "You" && avatar && avatar}
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
