"use client";

import { BouncingLoader } from "@/components/bouncingLoader";
import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatList } from "@/components/chat/chatList";
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
import { useEffect, useState, useTransition } from "react";
import { AudioInput } from "./components/audioInput";
import { attachmentSubmit, onDeleteModelMessages } from "@/libs/chat/functions";
import { initAudioSettings } from "./data";
import { generateUUID } from "@/libs/uuid";
import { AudioToTextSettings } from "./types";
import { attachmentResponse } from "./functions";
import { DeleteMessagesButton } from "@/components/chat/deleteMessagesButton";
import { ChatHeader } from "@/components/chat/chatHeader";
import { Stack } from "@mui/material";
import { SettingsDialog } from "./components/settingsDialog";
import { SelectLanguage } from "./components/selectLanguage";

interface AudioToTextPros {
  models: ModelProps[];
  chats: ChatMessagesProps;
  onMessage?: (
    message: MessageProps,
    contactId: string
  ) => Promise<void> | void;
  onDeleteMessages?: (modelId?: string) => Promise<void> | void;
  onSettingsChange?: (settings: AudioToTextSettings) => Promise<void> | void;
}

export function AudioToText({
  models,
  chats: allChats,
  onMessage,
  onDeleteMessages,
  onSettingsChange,
}: AudioToTextPros) {
  const [selectedModel, setSelectedModel] = useState<ModelProps | undefined>(
    undefined
  );
  const [chats, setChats] = useState<ChatMessagesProps>(allChats);
  const [settings, setSettings] =
    useState<AudioToTextSettings>(initAudioSettings);
  const [isPending, startTransition] = useTransition();

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
      setChats
    );
    await onMessage?.(newMessage, selectedModel!.id);
    startTransition(async () => {
      const response = await attachmentResponse(
        file,
        newId,
        selectedModel!,
        setChats,
        settings
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

  return (
    <ChatContainer
      chatHeader={
        <ChatHeader
          chatOptions={
            <Stack direction="row" gap={0.5}>
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
              <EmptyMessagesPane />
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
              <AudioInput
                settings={settings}
                setSettings={setSettings}
                onSubmit={onMessageHandler}
                isPending={isPending}
              />
            }
          />
        )
      }
    />
  );
}
