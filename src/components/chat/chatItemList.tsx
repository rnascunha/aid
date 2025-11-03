import { ChatMessage, MessageProps, ModelProps } from "./types";
import {
  Divider,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  Stack,
  Typography,
} from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { StaticAvatar } from "./staticAvatar";
import { toggleMessagesPane } from "./utils";
import { providerMap } from "@/appComponents/chat/data";

type ChatListItemProps = ListItemButtonProps & {
  model: ModelProps;
  sender: ModelProps;
  messages: MessageProps[];
  selectedModel: ModelProps | undefined;
  setSelectedModel: (chat: ModelProps) => void;
};

function getFormatedTimestamp(messages: MessageProps[]) {
  return messages.at(-1)?.timestamp
    ? dayjs().to(messages.at(-1)?.timestamp)
    : "";
}

function getDetailMessage(message: ChatMessage | undefined) {
  if (!message) return "";
  if ("error" in message) return message.error;
  return message.response;
}

export default function ChatListItem({
  model,
  sender,
  messages,
  selectedModel,
  setSelectedModel,
}: ChatListItemProps) {
  const [formatTimestamp, setFormatTimestamp] = useState(
    getFormatedTimestamp(messages)
  );
  const selected = selectedModel?.id === model.id;

  useEffect(() => {
    const handle = setInterval(
      () => setFormatTimestamp(getFormatedTimestamp(messages)),
      30 * 1000
    );
    return () => clearInterval(handle);
  }, [messages]);

  const message = messages.at(-1)?.content;

  return (
    <Fragment>
      <ListItem sx={{ p: 0 }}>
        <ListItemButton
          onClick={() => {
            setSelectedModel(model);
            toggleMessagesPane();
          }}
          selected={selected}
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
              <StaticAvatar
                src={providerMap[sender.providerId].logo}
                alt={sender.name}
              />
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
                  {sender.model}
                </Typography>
              </Stack>
            </Stack>
            <Typography color="textSecondary" fontSize="small" noWrap>
              {formatTimestamp}
            </Typography>
          </Stack>
          <Typography
            color={message && "success" in message ? "textSecondary" : "error"}
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
      <Divider sx={{ margin: 0 }} />
    </Fragment>
  );
}
