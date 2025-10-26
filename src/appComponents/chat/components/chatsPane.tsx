import ChatListItem from "./chatListItem";
import { ChatProps, ProviderProps } from "../types";
import { Box, Container, List, Typography } from "@mui/material";
import { providerMap } from "../data";

type ChatsPaneProps = {
  chats: ChatProps;
  chatList: ProviderProps["id"][];
  setSelectedProviderId: (chat: ProviderProps["id"]) => void;
  selectedProviderId: ProviderProps["id"];
};

export default function ChatsPane(props: ChatsPaneProps) {
  const { chats, chatList, selectedProviderId, setSelectedProviderId } = props;

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
            const user = providerMap.get(id) as ProviderProps;
            return (
              <ChatListItem
                key={user.id}
                id={user.id}
                sender={user}
                messages={chats[user.id]}
                setSelectedProviderId={setSelectedProviderId}
                selectedProviderId={selectedProviderId}
              />
            );
          })}
        </List>
      </Container>
    </Box>
  );
}
