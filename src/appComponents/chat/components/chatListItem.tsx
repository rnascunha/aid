import AvatarWithStatus from "./avatarWithStatus";
import { MessageProps, UserProps } from "../types";
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

type ChatListItemProps = ListItemButtonProps & {
  id: string;
  unread?: boolean;
  sender: UserProps;
  messages: MessageProps[];
  selectedUserId?: UserProps["id"];
  setSelectedUserId: (chat: UserProps["id"]) => void;
};

function getFormatedTimestamp(messages: MessageProps[]) {
  return messages.at(-1)?.timestamp
    ? dayjs().to(messages.at(-1)?.timestamp)
    : "";
}

export default function ChatListItem(props: ChatListItemProps) {
  const { id, sender, messages, selectedUserId, setSelectedUserId } = props;
  const [formatTimestamp, setFormatTimestamp] = useState(
    getFormatedTimestamp(messages)
  );
  const selected = selectedUserId === id;

  useEffect(() => {
    const handle = setInterval(
      () => setFormatTimestamp(getFormatedTimestamp(messages)),
      30 * 1000
    );
    return () => clearInterval(handle);
  }, [messages]);

  return (
    <Fragment>
      <ListItem sx={{ p: 0 }}>
        <ListItemButton
          onClick={() => {
            setSelectedUserId(id);
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
              <AvatarWithStatus
                online={sender.online}
                src={sender.logo}
                alt={sender.name}
              />
              <Typography>{sender.name}</Typography>
            </Stack>
            <Typography color="textSecondary" fontSize="small">
              {formatTimestamp}
            </Typography>
          </Stack>
          <Typography
            color="textSecondary"
            fontSize="small"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: "1",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {messages.at(-1)?.content ?? ""}
          </Typography>
        </ListItemButton>
      </ListItem>
      <Divider sx={{ margin: 0 }} />
    </Fragment>
  );
}
