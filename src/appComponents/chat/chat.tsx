"use client";

import { useContext, useEffect, useState, useTransition } from "react";
import { Stack } from "@mui/material";

import { SettingsDialog } from "./components/settingsDialog";
import { ChatSettings } from "@/appComponents/chat/types";

import { ChatMessagesProps, MessageProps, ModelProps } from "@/libs/chat/types";
import { generateUUID } from "@/libs/uuid";
import {
  addRemoveModel,
  messageSubmit,
  onDeleteModelMessages,
} from "@/libs/chat/functions";

import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatsPane } from "@/components/chat/chatsPane";
import { ChatList, EmptyChatList } from "@/components/chat/chatList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import {
  MessageInput,
  MessageInputCheck,
} from "@/components/chat/messageInput";
import { MessagesHeader } from "@/components/chat/messagesHeader";
import { BouncingLoader } from "@/components/bouncingLoader";
import { MessageList } from "@/components/chat/messageList";
import { ChatHeader } from "@/components/chat/chatHeader";
import { DeleteMessagesButton } from "@/components/chat/deleteMessagesButton";
import { AddModel } from "@/components/chat/addModel";
import { messageResponse } from "./functions";
import { aIContext } from "@/components/chat/context";

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
  const { providers, tools } = useContext(aIContext);

  const selectedProvider = selectedModel?.providerId
    ? providers[selectedModel.providerId]
    : undefined;

  useEffect(() => {
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  const onMessageHandler = async (message: string) => {
    const newId = generateUUID();
    const providerAuth = providers[selectedModel!.providerId].auth;
    const newMessage = messageSubmit(message, newId, selectedModel!, setChats);
    await onMessage?.(newMessage, selectedModel!.id);
    startTransition(async () => {
      const response = await messageResponse(
        message,
        newId,
        selectedModel!,
        setChats,
        settings,
        chats[selectedModel!.id],
        providerAuth,
        tools
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
              <MessageInputCheck
                provider={selectedProvider!}
                input={
                  <MessageInput
                    onSubmit={onMessageHandler}
                    isPending={isPending}
                  />
                }
              />
            }
          />
        )
      }
    />
  );
}
