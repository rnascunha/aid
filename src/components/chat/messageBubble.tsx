import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { ChatMessage, MessageProps } from "./types";
import { Avatar, Box, Container, Stack, Typography } from "@mui/material";
import dayjs from "@/libs/dayjs";
import { useEffect, useState } from "react";
import { createHiperlinks } from "@/libs/links";
import { formatBytes } from "@/libs/formatData";

function getContentData(content: ChatMessage) {
  if ("success" in content)
    return (
      <Typography
        fontSize="14px"
        sx={{
          whiteSpace: "pre-line",
        }}
      >
        {createHiperlinks(content.response)}
      </Typography>
    );

  return (
    <Stack>
      <Typography fontSize="16px" fontWeight="bold">
        {content.error}
      </Typography>
      <Typography
        fontSize="14px"
        sx={{
          whiteSpace: "pre-line",
        }}
      >
        {createHiperlinks(content.detail)}
      </Typography>
    </Stack>
  );
}

interface MessageBubbleProps {
  variant: "sent" | "received";
  message: MessageProps;
}

function TextMessage({
  message,
  isSent,
}: {
  message: MessageProps;
  isSent: boolean;
}) {
  return (
    <Container
      sx={[
        {
          p: 1.25,
          borderRadius: "10px",
        },
        isSent
          ? {
              backgroundColor: "rgba(50, 50, 200, 0.7)",
              color: "white",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: 0,
            }
          : {
              backgroundColor:
                "success" in message.content
                  ? "rgba(200, 200, 200, 0.7)"
                  : "rgba(200, 5, 5, 0.5)",
              color: "black",
              borderTopLeftRadius: 0,
              borderTopRightRadius: "10px",
            },
      ]}
    >
      {getContentData(message.content)}
    </Container>
  );
}

function AttachmentMessage({
  message,
  isSent,
}: {
  message: MessageProps;
  isSent: boolean;
}) {
  const file = message.attachment!;
  return (
    <Container
      sx={[
        {
          p: 1.25,
          borderRadius: "10px",
        },
        isSent
          ? {
              backgroundColor: "rgba(50, 50, 200, 0.7)",
              color: "white",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: 0,
            }
          : {
              backgroundColor:
                "success" in message.content
                  ? "rgba(200, 200, 200, 0.7)"
                  : "rgba(200, 5, 5, 0.5)",
              color: "black",
              borderTopLeftRadius: 0,
              borderTopRightRadius: "10px",
            },
      ]}
    >
      <Stack>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar color="primary">
            <InsertDriveFileRoundedIcon />
          </Avatar>
          <div>
            <Typography>{file.name}</Typography>
            <Typography>{formatBytes(file.size)}</Typography>
          </div>
        </Stack>
        {file.type.startsWith("audio/") && (
          <audio controls>
            <source src={file.data} type={file.type} title={file.name} />
          </audio>
        )}
      </Stack>
    </Container>
  );
}

export function MessageBubble({ variant, message }: MessageBubbleProps) {
  const { timestamp, attachment = undefined } = message;
  const isSent = variant === "sent";
  const [formatTimestamp, setFormatTimestamp] = useState(dayjs().to(timestamp));

  useEffect(() => {
    const handle = setInterval(
      () => setFormatTimestamp(dayjs().to(timestamp)),
      30 * 1000
    );
    return () => clearInterval(handle);
  }, [timestamp]);

  return (
    <Box sx={{ maxWidth: "60%", minWidth: "auto" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "flex-end", mb: 0.25 }}
        width="100%"
      >
        <Typography color="textSecondary" fontSize="small">
          {formatTimestamp}
        </Typography>
      </Stack>
      {attachment ? (
        <AttachmentMessage message={message} isSent={isSent} />
      ) : (
        <TextMessage message={message} isSent={isSent} />
      )}
    </Box>
  );
}
