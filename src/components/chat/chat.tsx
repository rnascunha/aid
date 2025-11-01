"use client";

import { ChatContainer } from "./chatContainer";
import ChatsPane from "./chatsPane";
import { ChatList } from "./chatList";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { ChatMessagesProps, MessageProps, ModelProps } from "./types";
import MessagesPane from "./messagePane";
import MessageInput from "./messageInput";
import MessagesHeader from "./messagesHeader";
import { messageResponse, messageSubmit } from "./functions";
import { BouncingLoader } from "../bouncingLoader";
import { MessageList } from "./messageList";
import { ChatHeader } from "./chatHeader";
import { settings as initSettings } from "@/appComponents/chat/data";
import { SettingsDialog } from "@/appComponents/chat/components/settingsDialog";
import { DeleteMessagesButton } from "./deleteMessagesButton";

export interface ChatProps {
  models: ModelProps[];
  chats: ChatMessagesProps;
  onMessage?: (
    message: MessageProps,
    contactId: string
  ) => Promise<void> | void;
  onDelete?: (modelId?: string) => Promise<void> | void;
}

async function onDeleteModelMessages(
  modelId: string,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  onDeleteModel?: (modelId: string) => Promise<void> | void
) {
  await onDeleteModel?.(modelId);
  setChats((prev) => ({
    ...prev,
    [modelId]: [],
  }));
}

export function Chat({
  models,
  chats: allChats,
  onMessage,
  onDelete,
}: ChatProps) {
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
      MessagePane={
        <MessagesPane
          header={
            <MessagesHeader
              model={selectedModel}
              options={
                <DeleteMessagesButton
                  onDelete={async () =>
                    await onDeleteModelMessages(
                      selectedModel.id,
                      setChats,
                      onDelete
                    )
                  }
                />
              }
            />
          }
          loader={isPending && <BouncingLoader />}
          messages={<MessageList messages={chats[selectedModel.id]} />}
          input={
            <MessageInput
              onSubmit={(value) => {
                const newId = chats[selectedModel.id].length + 1;
                const newMessage = messageSubmit(
                  value,
                  newId,
                  selectedModel,
                  setChats
                );
                if (onMessage) onMessage(newMessage, selectedModel.id);
                startTransition(async () => {
                  const response = await messageResponse(
                    value,
                    newId,
                    selectedModel,
                    setChats,
                    settings,
                    chats[selectedModel.id]
                  );
                  if (onMessage) onMessage(response, selectedModel.id);
                });
              }}
              isPending={isPending}
            />
          }
        />
      }
    />
  );
}
