import { ChatMessage, MessageProps, ModelProps } from "../../libs/chat/types";
import {
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { StaticAvatar } from "./staticAvatar";
import { toggleMessagesPane } from "@/libs/chat/utils";
import { providerMap } from "@/libs/chat/data";
import { aIContext } from "./context";
import { checkProviderAvaiable } from "@/libs/chat/functions";

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
  const { providers } = useContext(aIContext);

  const selected = selectedModel?.id === model.id;
  const hasProviderAuth = checkProviderAvaiable(providers[model.providerId]);

  useEffect(() => {
    const handle = setInterval(
      () => setFormatTimestamp(getFormatedTimestamp(messages)),
      30 * 1000
    );
    return () => clearInterval(handle);
  }, [messages]);

  const message = messages.at(-1)?.content;

  return (
    <ListItem
      sx={{
        p: 0,
        borderBottom: "1px solid",
        borderColor: "lightgray",
        bgcolor: hasProviderAuth ? "inherit" : "background.paper",
      }}
    >
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
  );
}
