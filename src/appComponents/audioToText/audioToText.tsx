"use client";

import { BouncingLoader } from "@/components/bouncingLoader";
import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatList, EmptyChatList } from "@/components/chat/chatList";
import { ChatsPane } from "@/components/chat/chatsPane";
import { MessageList } from "@/components/chat/messageList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import { MessagesHeader } from "@/components/chat/messagesHeader";
import {
  Attachment,
  ChatMessagesProps,
  MessageProps,
  ModelProps,
} from "@/libs/chat/types";
import { useContext, useEffect, useMemo, useState, useTransition } from "react";
import { AudioInput } from "./components/audioInput";
import {
  addRemoveModel,
  attachmentSubmit,
  onDeleteModelMessages,
  removeModelsFromRemovedProviders,
} from "@/libs/chat/functions";
import { generateUUID } from "@/libs/uuid";
import { AudioToTextSettings } from "./types";
import { attachmentResponse } from "./functions";
import { DeleteMessagesButton } from "@/components/chat/deleteMessagesButton";
import { ChatHeader } from "@/components/chat/chatHeader";
import { Stack } from "@mui/material";
import { SettingsDialog } from "./components/settingsDialog";
import { SelectLanguage } from "./components/selectLanguage";
import { MessageInputCheck } from "@/components/chat/messageInput";
import { aIContext } from "@/components/chat/context";
import { AddModel, AddModelButton } from "./components/addModel";
import { providerBaseMap } from "@/libs/chat/data";

interface AudioToTextPros {
  models: ModelProps[];
  chats: ChatMessagesProps;
  settings: AudioToTextSettings;
  onMessage?: (
    message: MessageProps,
    contactId: string
  ) => Promise<void> | void;
  onDeleteMessages?: (modelId?: string) => Promise<void> | void;
  onSettingsChange?: (settings: AudioToTextSettings) => Promise<void> | void;
  onAddRemoveModel?: (model: string | ModelProps) => Promise<void> | void;
}

export function AudioToText({
  models: allModel,
  chats: allChats,
  settings: initSettings,
  onMessage,
  onDeleteMessages,
  onSettingsChange,
  onAddRemoveModel,
}: AudioToTextPros) {
  const [selectedModel, setSelectedModel] = useState<ModelProps | undefined>(
    undefined
  );
  const [models, setModels] = useState<ModelProps[]>(allModel);
  const [chats, setChats] = useState<ChatMessagesProps>(allChats);
  const [settings, setSettings] = useState<AudioToTextSettings>(initSettings);
  const [isPending, startTransition] = useTransition();

  const { providers } = useContext(aIContext);
  const audioToTextProviders = useMemo(() => {
    const cp = providers.filter((p) =>
      providerBaseMap[p.providerBaseId].type.includes("audioToText")
    );
    // Remove models from removed providers
    removeModelsFromRemovedProviders(cp, setModels);
    return cp;
  }, [providers, setModels]);

  // Get provider from selected model
  const selectedProvider = !selectedModel
    ? undefined
    : audioToTextProviders.find((p) => p.id === selectedModel?.providerId);

  // Check if selected model still exist
  if (
    selectedModel &&
    !audioToTextProviders.find((p) => p.id === selectedModel?.providerId)
  ) {
    setSelectedModel(undefined);
  }

  useEffect(() => {
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  const onMessageHandler = async (file: Attachment | null) => {
    if (!file) return;
    const newId = generateUUID();
    const newMessage = await attachmentSubmit(
      file,
      newId,
      selectedModel!,
      setChats,
      settings.prompt ? settings.prompt : undefined
    );
    await onMessage?.(newMessage, selectedModel!.id);
    startTransition(async () => {
      const response = await attachmentResponse(
        file,
        newId,
        selectedModel!,
        selectedProvider!,
        setChats,
        settings
      );
      await onMessage?.(response, selectedModel!.id);
    });
  };

  const onAddRemoveModelHandler = async (model: string | ModelProps) => {
    addRemoveModel(models, setModels, setChats, setSelectedModel, model);
    await onAddRemoveModel?.(model);
  };

  const onDeleteAllMessagesHandler = async () => {
    onDeleteModelMessages(setChats);
    await onDeleteMessages?.();
  };
  const onDeleteModelMessagesHandler = async (modelId: string) => {
    onDeleteModelMessages(setChats, modelId);
    await onDeleteMessages?.(modelId);
  };

  return (
    <ChatContainer
      chatHeader={
        <ChatHeader
          chatOptions={
            <Stack direction="row" gap={0.5}>
              <AddModel
                models={models}
                providers={audioToTextProviders}
                addRemoveModel={onAddRemoveModelHandler}
              />
              <SelectLanguage
                language={settings.language}
                setLanguage={(ln) =>
                  setSettings((prev) => ({
                    ...prev,
                    language: ln,
                  }))
                }
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
                addModelButton={
                  <AddModelButton
                    models={models}
                    addRemoveModel={onAddRemoveModelHandler}
                    providers={audioToTextProviders}
                  />
                }
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
        !selectedModel || !selectedProvider ? (
          <EmptyMessagesPane />
        ) : (
          <MessagesPane
            header={
              <MessagesHeader
                model={selectedModel}
                provider={selectedProvider}
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
                  <AudioInput
                    settings={settings}
                    setSettings={setSettings}
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
