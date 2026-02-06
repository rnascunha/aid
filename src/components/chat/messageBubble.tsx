import {
  MessageContentStatus,
  MessageProps,
  PartType,
  Part,
  PartInlineData,
  PartText,
  PartFunctionCall,
  PartFunctionResponse,
  TypeMessage,
} from "@/libs/chat/types";
import {
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  TypographyProps,
} from "@mui/material";
import dayjs from "@/libs/dayjs";
import { useEffect, useState } from "react";
import { formatBytes } from "@/libs/formatData";

import { isStatusMessage } from "@/libs/chat/functions";

import { MarkdownText } from "./markdownText";
import { calculateBase64SizeInBytes } from "@/libs/base64";
import { downloadBase64 } from "@/libs/download";

import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import DataObjectIcon from "@mui/icons-material/DataObject";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import DownloadIcon from "@mui/icons-material/Download";

const messageTypeBGStyle: Record<string, string> = {
  [TypeMessage.ERROR]: "var(--mui-palette-error-main)",
  [TypeMessage.WARNING]: "var(--mui-palette-warning-main)",
  [TypeMessage.SUCCESS]: "var(--mui-palette-success-main)",
  [TypeMessage.INFO]: "var(--mui-palette-info-main)",
  [`${TypeMessage.MESSAGE}:sent`]: "rgba(130, 103, 177, 0.7)",
  [`${TypeMessage.MESSAGE}:received`]: "rgba(200, 200, 200, 0.7)",
};

function TypographyS({ sx, children, ...other }: TypographyProps) {
  return (
    <Typography
      sx={{
        fontSize: "13px",
        ...sx,
      }}
      {...other}
    >
      {children}
    </Typography>
  );
}

function getMessageBGStyle(message: MessageProps) {
  if (isStatusMessage(message)) return messageTypeBGStyle[message.type];
  return messageTypeBGStyle[`${TypeMessage.MESSAGE}:${message.origin}`];
}

function StatusMessage({ message }: { message: MessageProps }) {
  const content = message.content as MessageContentStatus;
  return (
    <Stack>
      <Typography fontSize="16px" fontWeight="bold" textTransform="capitalize">
        {content.name ?? message.type}
      </Typography>
      <MarkdownText>{content.text}</MarkdownText>
    </Stack>
  );
}

function ThoughtPart() {
  return <Divider>Thought</Divider>;
}

function PartTextMessage({ text }: { text: PartText }) {
  return <MarkdownText>{text}</MarkdownText>;
}

function FileIconType({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("audio/")) return <AudioFileIcon />;
  switch (mimeType) {
    case "application/json":
      return <DataObjectIcon />;
    default:
      return <InsertDriveFileRoundedIcon />;
  }
}

function PartInlineMessage({ indata }: { indata: PartInlineData }) {
  const size = formatBytes(
    indata.size ?? calculateBase64SizeInBytes(indata.data),
  );
  return (
    <Stack>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" gap={1} alignItems="center">
          <Avatar color="primary">
            <FileIconType mimeType={indata.mimeType} />
          </Avatar>
          <div>
            <TypographyS>{indata.displayName ?? indata.mimeType}</TypographyS>
            <TypographyS>{size}</TypographyS>
          </div>
        </Stack>
        <Tooltip title="Download">
          <IconButton
            onClick={async () => {
              downloadBase64(indata.data, indata.displayName ?? "file");
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      {indata.mimeType.startsWith("audio/") && (
        <audio controls style={{ paddingTop: "8px" }}>
          <source
            src={`data:${indata.mimeType};base64,${indata.data}`}
            type={indata.mimeType}
            title={indata.displayName}
          />
        </audio>
      )}
    </Stack>
  );
}

function PartFunctionCallMessage({ call }: { call: PartFunctionCall }) {
  return (
    <Stack>
      <Divider>Function Call</Divider>
      {/* <TypographyS>{`ID: ${call.id}`}</TypographyS> */}
      <TypographyS
        sx={{
          whiteSpace: "pre-line",
        }}
      >{`${call.name}\n${Object.entries(call.args)
        .map(([k, v]) => `${k} = ${v}`)
        .join("\n")}`}</TypographyS>
    </Stack>
  );
}

function PartFunctionResponseMessage({
  response,
}: {
  response: PartFunctionResponse;
}) {
  return (
    <Stack>
      <Divider>Function Response</Divider>
      {/* <TypographyS>{`ID: ${response.id}`}</TypographyS> */}
      <TypographyS>{response.name}</TypographyS>
      <TypographyS>
        {Object.entries(response.response)
          .map(([k, v]) => `${k} = ${v}`)
          .join("\n")}
      </TypographyS>
    </Stack>
  );
}

function MessagePart({ part }: { part: Part }) {
  return (
    <Stack
      sx={[
        part.thought
          ? {
              fontSize: "11px",
              backdropFilter: "brightness(0.9)",
              borderRadius: "5px",
              padding: "3px",
            }
          : {
              fontSize: "inherit",
            },
      ]}
    >
      {part.thought && <ThoughtPart />}
      {part[PartType.TEXT] && <PartTextMessage text={part[PartType.TEXT]} />}
      {part[PartType.INLINE_DATA] && (
        <PartInlineMessage indata={part[PartType.INLINE_DATA]} />
      )}
      {part[PartType.FUNCTION_CALL] && (
        <PartFunctionCallMessage call={part[PartType.FUNCTION_CALL]} />
      )}
      {part[PartType.FUNCTION_RESPONSE] && (
        <PartFunctionResponseMessage
          response={part[PartType.FUNCTION_RESPONSE]}
        />
      )}
    </Stack>
  );
}

function MessageContent({ message }: { message: MessageProps }) {
  if (isStatusMessage(message)) return <StatusMessage message={message} />;

  const parts = message.content as Part[];
  const elements = parts
    .map((p, i) => [
      <MessagePart key={`${i}:m`} part={p} />,
      <Divider key={i} sx={{ my: 1 }} />,
    ])
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
      30 * 1000,
    );
    return () => clearInterval(handle);
  }, [timestamp]);

  return (
    <Box
      sx={{
        maxWidth: { sm: "90%", md: "80%", lg: "70%" },
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
