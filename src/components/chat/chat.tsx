"use client";

import { ChatContainer } from "./chatContainer";
import ChatsPane from "./chatsPane";
import { ChatList } from "./chatList";
import { useState, useTransition } from "react";
import { ChatMessagesProps, ModelProps } from "./types";
import MessagesPane from "./messagePane";
import MessageInput from "./messageInput";
import MessagesHeader from "./messagesHeader";
import { messageResponse, messageSubmit } from "./functions";
import { BouncingLoader } from "../bouncingLoader";
import { MessageList } from "./messageList";
import { ChatHeader } from "./chatHeader";
import { settings as initSettings } from "@/appComponents/chat/data";
import { SettingsDialog } from "@/appComponents/chat/components/settingsDialog";

export interface ChatProps {
  models: ModelProps[];
  chats: ChatMessagesProps;
}

export function Chat({ models, chats: allChats }: ChatProps) {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [chats, setChats] = useState<ChatMessagesProps>(allChats);
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initSettings);

  return (
    <ChatContainer
      chatsPane={
        <ChatsPane
          chatHeader={
            <ChatHeader
              chatOptions={
                <SettingsDialog settings={settings} setSettings={setSettings} />
              }
            />
          }
          modelsList={
            <ChatList
              models={models}
              chats={chats}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          }
        />
      }
      // MessagePane={<div></div>}
      MessagePane={
        <MessagesPane
          header={<MessagesHeader model={selectedModel} />}
          loader={isPending && <BouncingLoader />}
          messages={<MessageList messages={chats[selectedModel.id]} />}
          input={
            <MessageInput
              onSubmit={(value) => {
                const newId = chats[selectedModel.id].length + 1;
                messageSubmit(value, newId, selectedModel, setChats);
                startTransition(
                  async () =>
                    await messageResponse(
                      value,
                      newId,
                      selectedModel,
                      setChats,
                      settings,
                      chats[selectedModel.id]
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
