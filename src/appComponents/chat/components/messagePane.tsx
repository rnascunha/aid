import AvatarWithStatus from "./avatarWithStatus";
import ChatBubble from "./chatBubble";
import MessageInput from "./messageInput";
import MessagesPaneHeader from "./messagesPaneHeader";
import { ChatProps, MessageProps, UserProps } from "../types";
import { Box, Container, Stack } from "@mui/material";
import { users } from "../data";

type MessagesPaneProps = {
  selectedUserId: UserProps["id"];
  chats: ChatProps;
  setChats: (chats: ChatProps) => void;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const { selectedUserId, chats, setChats } = props;

  return (
    <Container
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <MessagesPaneHeader
        sender={users.find((u) => u.id === selectedUserId) as UserProps}
      />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: "auto",
          flexDirection: "column-reverse",
          position: "relative",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            justifyContent: "flex-end",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            p: 0.5,
          }}
        >
          {chats[selectedUserId].map((message: MessageProps, index: number) => {
            const isYou = message.sender === "You";
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                sx={{ flexDirection: isYou ? "row-reverse" : "row" }}
              >
                {message.sender !== "You" && (
                  <AvatarWithStatus
                    online={message.sender.online}
                    src={message.sender.logo}
                    alt={message.sender.name}
                  />
                )}
                <ChatBubble
                  variant={isYou ? "sent" : "received"}
                  {...message}
                />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        onSubmit={(value) => {
          const newId = chats[selectedUserId].length + 1;
          const newIdString = newId.toString();
          setChats({
            ...chats,
            [selectedUserId]: [
              ...chats[selectedUserId],
              {
                id: newIdString,
                sender: "You",
                content: value,
                timestamp: Date.now(),
              },
            ],
          });
        }}
      />
    </Container>
  );
}
