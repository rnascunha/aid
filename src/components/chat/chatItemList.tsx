import {
  BaseSender,
  MessageExachange,
  MessageProps,
  MessageStatus,
  PartInlineData,
  PartText,
  PartType,
  TypeMessage,
} from "@/libs/chat/types";
import {
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toggleMessagesPane } from "@/components/chat/utils";
import { getPartType, isStatusMessage } from "@/libs/chat/functions";
import { StaticAvatar } from "./staticAvatar";
import { StaticImageData } from "next/image";

function getFormatedTimestamp(messages: MessageProps[]) {
  return messages.at(-1)?.timestamp
    ? dayjs().to(messages.at(-1)?.timestamp)
    : "";
}

function getDetailMessage(message?: MessageProps): string {
  if (!message) return "";
  if (isStatusMessage(message)) return (message as MessageStatus).content.text;
  const part = (message as MessageExachange).content.at(-1);
  if (!part) return "";

  const partType = getPartType(part);
  if (partType === PartType.TEXT)
    return (part as unknown as PartText).text as string;
  if (partType === PartType.INLINEDATA) {
    const partIL = part as unknown as PartInlineData;
    return "displayName" in partIL
      ? `File: ${partIL.inlineData.displayName}`
      : `File: ${partIL.inlineData.mimeType}`;
  }
  return "";
}

type ChatListItemProps = ListItemButtonProps & {
  sender: BaseSender;
  messages: MessageProps[];
  isSelected: boolean;
  setSelectedModel: (chat: BaseSender) => void;
  avatar?: StaticImageData;
  bgcolor?: string;
};

export default function ChatListItem({
  sender,
  messages,
  isSelected,
  setSelectedModel,
  avatar,
  bgcolor = "inherit",
}: ChatListItemProps) {
  const [formatTimestamp, setFormatTimestamp] = useState(
    getFormatedTimestamp(messages)
  );
  useEffect(() => {
    const handle = setInterval(
      () => setFormatTimestamp(getFormatedTimestamp(messages)),
      30 * 1000
    );
    return () => clearInterval(handle);
  }, [messages]);

  const message = messages.at(-1);

  return (
    <ListItem
      sx={{
        p: 0,
        borderBottom: "1px solid",
        borderColor: "lightgray",
        bgcolor,
      }}
    >
      <ListItemButton
        onClick={() => {
          setSelectedModel(sender);
          toggleMessagesPane();
        }}
        selected={isSelected}
        color="neutral"
        sx={{
          flexDirection: "column",
          alignItems: "initial",
          gap: 1,
          p: 1.25,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <StaticAvatar src={avatar} alt={sender.name} />
            <Stack>
              <Typography>{sender.name}</Typography>
              <Typography
                fontSize="small"
                color="textSecondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: "1",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {sender.name}
              </Typography>
            </Stack>
          </Stack>
          <Typography color="textSecondary" fontSize="small" noWrap>
            {formatTimestamp}
          </Typography>
        </Stack>
        <Typography
          color={
            message?.type === TypeMessage.MESSAGE
              ? "textSecondary"
              : message?.type
          }
          fontSize="small"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {getDetailMessage(message)}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
}
