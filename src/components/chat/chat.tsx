"use client";

import { ChatContainer } from "./chatContainer";
import ChatsPane from "./chatsPane";
import { ChatList } from "./chatList";
import { useState, useTransition } from "react";
import { ChatMessagesProps, ProviderProps } from "./types";
import MessagesPane from "./messagePane";
import MessageInput from "./messageInput";
import MessagesHeader from "./messagesHeader";
import { contextMessages, messageResponse, messageSubmit } from "./functions";
import { BouncingLoader } from "../bouncingLoader";
import { MessageList } from "./messageList";
import { ChatHeader } from "./chatHeader";

export interface ChatProps {
  providers: ProviderProps[];
  chats: ChatMessagesProps;
}

export function Chat({ providers, chats: allChats }: ChatProps) {
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [chats, setChats] = useState<ChatMessagesProps>(allChats);
  const [isPending, startTransition] = useTransition();

  return (
    <ChatContainer
      chatsPane={
        <ChatsPane
          chatHeader={<ChatHeader />}
          providersList={
            <ChatList
              providers={providers}
              chats={chats}
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
            />
          }
        />
      }
      MessagePane={
        <MessagesPane
          header={<MessagesHeader provider={selectedProvider} />}
          loader={isPending && <BouncingLoader />}
          messages={<MessageList messages={chats[selectedProvider.id]} />}
          input={
            <MessageInput
              onSubmit={(value) => {
                const newId = chats[selectedProvider.id].length + 1;
                messageSubmit(value, newId, selectedProvider, setChats);
                startTransition(
                  async () =>
                    await messageResponse(
                      value,
                      newId,
                      selectedProvider,
                      setChats,
                      contextMessages(chats[selectedProvider.id], {
                        max: 10,
                        elapsedTimeMs: 15 * 60 * 1000,
                      })
                    )
                );
              }}
              isPending={isPending}
            />
          }
        />
      }
    />
  );
}
