import ChatListItem from "./chatListItem";
import { ChatProps, UserProps } from "../types";
import { Box, Container, List, Typography } from "@mui/material";
import { users } from "../data";

type ChatsPaneProps = {
  chats: ChatProps;
  chatList: UserProps["id"][];
  setSelectedUserId: (chat: UserProps["id"]) => void;
  selectedUserId: UserProps["id"];
};

export default function ChatsPane(props: ChatsPaneProps) {
  const { chats, chatList, setSelectedUserId, selectedUserId } = props;

  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        overflowY: "auto",
        px: 0,
      }}
    >
      <Container
        disableGutters
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          p: 0,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontSize: "20px",
            fontWeight: "lg",
            mr: "auto",
          }}
        >
          AIs
        </Typography>
        <List dense>
          {chatList.map((id) => {
            const user = users.find((u) => u.id === id) as UserProps;
            return (
              <ChatListItem
                key={user.id}
                id={user.id}
                sender={user}
                messages={chats[user.id]}
                setSelectedUserId={setSelectedUserId}
                selectedUserId={selectedUserId}
              />
            );
          })}
        </List>
      </Container>
    </Box>
  );
}
