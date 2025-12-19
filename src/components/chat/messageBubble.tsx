import {
  MessageContentStatus,
  MessageProps,
  Part,
  PartInlineData,
  PartText,
  PartType,
  TypeMessage,
} from "@/libs/chat/types";
import {
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "@/libs/dayjs";
import { ReactNode, useEffect, useState } from "react";
import { formatBytes } from "@/libs/formatData";

import { getPartType, isStatusMessage } from "@/libs/chat/functions";

import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { MarkdownText } from "./markdownText";

const messageTypeBGStyle: Record<string, string> = {
  [TypeMessage.ERROR]: "var(--mui-palette-error-main)",
  [TypeMessage.WARNING]: "var(--mui-palette-warning-main)",
  [TypeMessage.SUCCESS]: "var(--mui-palette-success-main)",
  [TypeMessage.INFO]: "var(--mui-palette-info-main)",
  [`${TypeMessage.MESSAGE}:sent`]: "rgba(130, 103, 177, 0.7)",
  [`${TypeMessage.MESSAGE}:received`]: "rgba(200, 200, 200, 0.7)",
};

function getMessageBGStyle(message: MessageProps) {
  if (isStatusMessage(message)) return messageTypeBGStyle[message.type];
  return messageTypeBGStyle[`${TypeMessage.MESSAGE}:${message.origin}`];
}

function PartTextMessage({ part }: { part: PartText }) {
  if ("thought" in part && part.thought)
    return (
      <Stack>
        <Divider><Typography fontSize="14px" fontStyle="italic">Thought</Typography></Divider>
        <MarkdownText pstyle={{
          fontSize: "13px"
        }}>{part.text}</MarkdownText>
      </Stack>
    );

  return <MarkdownText>{part.text}</MarkdownText>;
}

function PartInlineMessage({ part }: { part: PartInlineData }) {
  return (
    <Stack>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Avatar color="primary">
          <InsertDriveFileRoundedIcon />
        </Avatar>
        <div>
          <Typography>
            {part.inlineData.displayName ?? part.inlineData.mimeType}
          </Typography>
          <Typography>
            {formatBytes(part.inlineData.size ?? part.inlineData.data.length)}
          </Typography>
        </div>
      </Stack>
      {part.inlineData.mimeType.startsWith("audio/") && (
        <audio controls>
          <source
            src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`}
            type={part.inlineData.mimeType}
            title={part.inlineData.displayName}
          />
        </audio>
      )}
    </Stack>
  );
}

function MessageContent({ message }: { message: MessageProps }) {
  if (isStatusMessage(message)) {
    const content = message.content as MessageContentStatus;
    return (
      <Stack>
        <Typography
          fontSize="16px"
          fontWeight="bold"
          textTransform="capitalize"
        >
          {content.name ?? message.type}
        </Typography>
        <MarkdownText>{content.text}</MarkdownText>
      </Stack>
    );
  }

  const parts = message.content as Part[];
  const elements = parts
    .reduce((acc, p, i) => {
      const partType = getPartType(p);
      switch (partType) {
        case PartType.TEXT:
          acc.push(<PartTextMessage key={`${i}:t`} part={p as PartText} />);
          break;
        case PartType.INLINEDATA:
          acc.push(
            <PartInlineMessage key={`${i}:id`} part={p as PartInlineData} />
          );
          break;
      }
      return acc;
    }, [] as ReactNode[])
    .map((e, i) => [e, <Divider key={i} sx={{ my: 1 }} />])
    .flat();
  elements.pop();

  return elements;
}

interface MessageBubbleProps {
  message: MessageProps;
  onClick?: () => void;
}

export function MessageBubble({ message, onClick }: MessageBubbleProps) {
  const { timestamp } = message;
  const isSent = message.origin === "sent";
  const [formatTimestamp, setFormatTimestamp] = useState(dayjs().to(timestamp));

  useEffect(() => {
    const handle = setInterval(
      () => setFormatTimestamp(dayjs().to(timestamp)),
      30 * 1000
    );
    return () => clearInterval(handle);
  }, [timestamp]);

  return (
    <Box
      sx={{
        maxWidth: { sm: "60%", xs: "70%" },
        minWidth: "auto",
        position: "relative",
        "&:hover .detail-message-icon": {
          opacity: 1,
        },
      }}
    >
      <IconButton
        className="detail-message-icon"
        sx={[
          {
            position: "absolute",
            top: "calc(50% + 10px)",
            transform: "translateY(-50%)",
            opacity: 0,
            transition: "opacity 0.3s",
          },
          isSent ? { left: "-35px" } : { right: "-35px" },
        ]}
        onClick={onClick}
      >
        <InfoOutlineIcon />
      </IconButton>
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
      <Container
        sx={[
          {
            p: 1.25,
            borderRadius: "10px",
            color: "var(--mui-palette-text-primary)",
          },
          isSent
            ? {
                backgroundColor: getMessageBGStyle(message),
                borderTopRightRadius: 0,
              }
            : {
                backgroundColor: getMessageBGStyle(message),
                borderTopRightRadius: "10px",
              },
        ]}
      >
        <MessageContent message={message} />
      </Container>
    </Box>
  );
}
