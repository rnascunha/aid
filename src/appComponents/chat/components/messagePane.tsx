import AvatarWithStatus from "./avatarWithStatus";
import ChatBubble from "./chatBubble";
import MessageInput from "./messageInput";
import MessagesPaneHeader from "./messagesPaneHeader";
import { ChatProps, MessageProps, ProviderProps } from "../types";
import { Box, Container, Stack } from "@mui/material";
import { providerMap } from "../data";
import { chatRequest } from "@/actions/ai/chat";
import { Dispatch, SetStateAction, useTransition } from "react";

type MessagesPaneProps = {
  selectedProviderId: ProviderProps["id"];
  chats: ChatProps;
  setChats: Dispatch<SetStateAction<ChatProps>>;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const { selectedProviderId, chats, setChats } = props;
  const [isPending, startTransition] = useTransition();

  const provider = providerMap.get(selectedProviderId) as ProviderProps;

  return (
    <Container
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <MessagesPaneHeader sender={provider} />
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
          {chats[selectedProviderId].map(
            (message: MessageProps, index: number) => {
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
            }
          )}
        </Stack>
      </Box>
      <MessageInput
        isPending={isPending}
        onSubmit={(value) => {
          const newId = chats[selectedProviderId].length + 1;
          const newIdString = newId.toString();
          setChats((prev) => ({
            ...prev,
            [selectedProviderId]: [
              ...prev[selectedProviderId],
              {
                id: newIdString,
                sender: "You",
                content: { response: value, success: true },
                timestamp: Date.now(),
              },
            ],
          }));
          startTransition(async () => {
            const response = await chatRequest(
              provider.provider,
              provider.model,
              value
            );
            const newIdString2 = `${newId}:r`;
            setChats((prev) => ({
              ...prev,
              [selectedProviderId]: [
                ...prev[selectedProviderId],
                {
                  id: newIdString2,
                  sender: provider,
                  content: response,
                  timestamp: Date.now(),
                },
              ],
            }));
          });
        }}
      />
    </Container>
  );
}
