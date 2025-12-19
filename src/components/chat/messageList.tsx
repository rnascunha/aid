import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { MessageProps } from "../../libs/chat/types";
import { MessageBubble } from "./messageBubble";
import { ReactNode, useEffect, useRef, useState } from "react";
import JSONOutput from "../JSONOutput";

function MessageDetail({ message }: { message: MessageProps }) {
  return <JSONOutput src={message} name={null} />;
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

interface MessageListProps {
  messages: MessageProps[];
  avatar?: ReactNode;
}

export function MessageList({ messages, avatar }: MessageListProps) {
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
          const isYou = message.origin === "sent";
          return (
            <Stack
              key={index}
              direction="row"
              spacing={2}
              sx={{ flexDirection: isYou ? "row-reverse" : "row" }}
            >
              {!isYou && avatar}
              <MessageBubble
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
