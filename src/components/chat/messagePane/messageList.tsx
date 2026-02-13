import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Stack,
} from "@mui/material";
import { MessageProps } from "@/libs/chat/types";
import { MessageBubble } from "./messageBubble";
import { ReactNode, useEffect, useRef, useState } from "react";
import JSONOutput from "@/components/JSONOutput";
import { VList, VListHandle } from "virtua";

function MessageDetail({ message }: { message: MessageProps }) {
  return <JSONOutput src={message} name={false} displayDataTypes={false} />;
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

import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

function ScrollDownButton({
  unseen,
  onClick,
}: {
  unseen: number;
  onClick: () => void;
}) {
  return (
    <Badge
      sx={{
        position: "absolute",
        bottom: "15px",
        right: "15px",
        // zIndex: 10,
      }}
      badgeContent={unseen}
      color="primary"
    >
      <Fab size="small" onClick={onClick}>
        <ExpandCircleDownIcon />
      </Fab>
    </Badge>
  );
}

export function MessageList({ messages, avatar }: MessageListProps) {
  const el = useRef<VListHandle | null>(null);
  const [message, setMessage] = useState<MessageProps | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unseen, setUnseen] = useState(0);

  // Initiate scroll at the end
  useEffect(() => {
    const elem = el.current;
    if (!elem) return;
    elem.scrollToIndex(messages.length, { align: "end" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll when a new message is received
  useEffect(() => {
    if (!isAtBottom) {
      setUnseen((prev) => prev + 1);
      return;
    }
    const elem = el.current;
    if (!elem) return;
    elem.scrollToIndex(messages.length, { align: "end" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        px: 2,
        py: 3,
        position: "relative",
      }}
    >
      {!isAtBottom && (
        <ScrollDownButton
          unseen={unseen}
          onClick={() =>
            el.current?.scrollToIndex(messages.length, { align: "end" })
          }
        />
      )}
      <VList
        ref={el}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          // scrollBehavior: el.current ? "smooth" : "auto",
          padding: "0px 0px 8px 0px",
        }}
        data={messages}
        bufferSize={1000}
        onScrollEnd={() => {
          const elem = el.current;
          if (!elem) return;
          if (elem.scrollOffset - elem.scrollSize + elem.viewportSize >= -1.5) {
            setIsAtBottom(true);
            setUnseen(0);
          } else {
            setIsAtBottom(false);
          }
        }}
      >
        {(message, index) => {
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
        }}
      </VList>
      <MessageDetailDialog message={message} onClose={() => setMessage(null)} />
    </Box>
  );
}
