"use client";

import { ChatContainer } from "./chatContainer";
import ChatsPane from "./chatsPane";
import { ChatList, EmptyChatList } from "./chatList";
import { useEffect, useState, useTransition } from "react";
import { ChatMessagesProps, MessageProps, ModelProps } from "./types";
import { EmptyMessagesPane, MessagesPane } from "./messagePane";
import MessageInput from "./messageInput";
import MessagesHeader from "./messagesHeader";
import {
  addRemoveModel,
  messageResponse,
  messageSubmit,
  onDeleteModelMessages,
} from "./functions";
import { BouncingLoader } from "../bouncingLoader";
import { MessageList } from "./messageList";
import { ChatHeader } from "./chatHeader";
import { SettingsDialog } from "@/appComponents/chat/components/settingsDialog";
import { DeleteMessagesButton } from "./deleteMessagesButton";
import { Stack } from "@mui/material";
import { AddModel } from "./addModel";
import { generateUUID } from "@/libs/uuid";
import { ChatSettings } from "@/appComponents/chat/types";

export interface ChatProps {
  models: ModelProps[];
  chats: ChatMessagesProps;
  settings: ChatSettings;
  onMessage?: (
    message: MessageProps,
    contactId: string
  ) => Promise<void> | void;
  onDeleteMessages?: (modelId?: string) => Promise<void> | void;
  onAddRemoveModel?: (model: string | ModelProps) => Promise<void> | void;
  onSettingsChange?: (settings: ChatSettings) => Promise<void> | void;
}

export function Chat({
  models: allModels,
  chats: allChats,
  settings: initSettings,
  onMessage,
  onDeleteMessages,
  onAddRemoveModel,
  onSettingsChange,
}: ChatProps) {
  const [models, setModels] = useState<ModelProps[]>(allModels);
  const [selectedModel, setSelectedModel] = useState<ModelProps | undefined>(
    undefined
  );
  const [chats, setChats] = useState<ChatMessagesProps>(allChats);
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initSettings);

  useEffect(() => {
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  const onMessageHandler = async (message: string) => {
    const newId = generateUUID();
    const newMessage = messageSubmit(message, newId, selectedModel!, setChats);
    await onMessage?.(newMessage, selectedModel!.id);
    startTransition(async () => {
      const response = await messageResponse(
        message,
        newId,
        selectedModel!,
        setChats,
        settings,
        chats[selectedModel!.id]
      );
      await onMessage?.(response, selectedModel!.id);
    });
  };

  const onDeleteAllMessagesHandler = async () => {
    onDeleteModelMessages(setChats);
    await onDeleteMessages?.();
  };
  const onDeleteModelMessagesHandler = async (modelId: string) => {
    onDeleteModelMessages(setChats, modelId);
    await onDeleteMessages?.(modelId);
  };
  const onAddRemoveModelHandler = async (model: string | ModelProps) => {
    addRemoveModel(models, setModels, setChats, setSelectedModel, model);
    await onAddRemoveModel?.(model);
  };

  return (
    <ChatContainer
      chatHeader={
        <ChatHeader
          chatOptions={
            <Stack direction="row" gap={0.5}>
              <AddModel
                models={models}
                addRemoveModel={onAddRemoveModelHandler}
              />
              <SettingsDialog
                settings={settings}
                setSettings={setSettings}
                onDeleteMessages={onDeleteAllMessagesHandler}
              />
            </Stack>
          }
        />
      }
      chatsPane={
        <ChatsPane
          modelsList={
            models.length === 0 ? (
              <EmptyChatList
                models={models}
                onAddModel={onAddRemoveModelHandler}
              />
            ) : (
              <ChatList
                models={models}
                chats={chats}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />
            )
          }
        />
      }
      MessagePane={
        !selectedModel ? (
          <EmptyMessagesPane />
        ) : (
          <MessagesPane
            header={
              <MessagesHeader
                model={selectedModel}
                options={
                  <DeleteMessagesButton
                    onDelete={async () =>
                      await onDeleteModelMessagesHandler(selectedModel.id)
                    }
                  />
                }
              />
            }
            loader={isPending && <BouncingLoader />}
            messages={<MessageList messages={chats[selectedModel.id]} />}
            input={
              <MessageInput onSubmit={onMessageHandler} isPending={isPending} />
            }
          />
        )
      }
    />
  );
}
