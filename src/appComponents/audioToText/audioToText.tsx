"use client";

import { BouncingLoader } from "@/components/bouncingLoader";
import { ChatContainer } from "@/components/chat/chatContainer";
import { EmptyChatList } from "@/components/chat/chatList";
import { ChatModelList } from "@/components/chat/model/chatList";
import { ChatsPane } from "@/components/chat/chatsPane";
import { MessageList } from "@/components/chat/messageList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import { MessagesModelHeader } from "@/components/chat/model/messagesHeader";
import {
  BaseSender,
  ChatMessagesProps,
  MessageContentStatus,
  MessageProps,
  TypeMessage,
} from "@/libs/chat/types";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import {
  onDeleteMessages as onDeleteModelMessages,
  addRemoveSender as addRemoveModel,
  onMessageSendHandler,
} from "@/libs/chat/functions";
import { AudioToTextSettings } from "./types";
import { attachmentResponse } from "./functions";
import { DeleteMessagesButton } from "@/components/chat/deleteMessagesButton";
import { ChatHeader } from "@/components/chat/chatHeader";
import { Stack } from "@mui/material";
import { SettingsDialog } from "./components/settingsDialog";
import { SelectLanguage } from "./components/selectLanguage";
import { aIContext } from "@/components/chat/context";
import { AddModel, AddModelButton } from "./components/addModel";
import { providerBaseMap } from "@/libs/chat/models/data";
import { ModelProps, ProviderProps } from "@/libs/chat/models/types";
import ModelAvatar, {
  MessageInputCheck,
} from "@/components/chat/model/components";
import { removeModelsFromRemovedProviders } from "@/libs/chat/models/functions";
import { MessageInput } from "@/components/chat/input/messageInput";
import { InputOutput } from "@/components/chat/input/types";

interface AudioToTextPros {
  models: ModelProps[];
  chats: ChatMessagesProps;
  settings: AudioToTextSettings;
  onMessage?: (
    message: MessageProps,
    contactId: string,
  ) => Promise<void> | void;
  onDeleteMessages?: (modelId?: string) => Promise<void> | void;
  onSettingsChange?: (settings: AudioToTextSettings) => Promise<void> | void;
  onAddRemoveModel?: (model: string | ModelProps) => Promise<void> | void;
}

interface InputState {
  attachment: boolean;
  record: boolean;
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
  const [selectedModel, setSelectedModel] = useState<ModelProps | null>(null);
  const [models, setModels] = useState<ModelProps[]>(allModel);
  const [chats, setChats] = useState<ChatMessagesProps>(allChats);
  const [settings, setSettings] = useState<AudioToTextSettings>(initSettings);
  const [isPending, startTransition] = useTransition();
  const [inputState, setInputState] = useState<InputState>({
    attachment: false,
    record: false,
  });

  const { providers } = useContext(aIContext);
  const audioToTextProviders = useMemo(() => {
    const cp = providers.filter((p) =>
      providerBaseMap[p.providerBaseId].type.includes("audioToText"),
    );
    // Remove models from removed providers
    removeModelsFromRemovedProviders(cp, setModels);
    return cp;
  }, [providers, setModels]);

  // Get provider from selected model
  const selectedProvider = !selectedModel
    ? null
    : audioToTextProviders.find((p) => p.id === selectedModel?.providerId);

  // Check if selected model still exist
  if (
    selectedModel &&
    !audioToTextProviders.find((p) => p.id === selectedModel?.providerId)
  ) {
    setSelectedModel(null);
  }

  useEffect(() => {
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  const onMessageHandler = async (
    messages: InputOutput | MessageContentStatus,
    type: TypeMessage,
  ) => {
    if (
      type === TypeMessage.MESSAGE &&
      (messages as InputOutput).files.length !== 1
    )
      return;

    const newMessage = onMessageSendHandler(
      messages,
      type,
      selectedModel!.id,
      setChats,
    );
    await onMessage?.(newMessage, selectedModel!.id);
    if (newMessage.type !== TypeMessage.MESSAGE) return;

    startTransition(async () => {
      const response = await attachmentResponse({
        data: (messages as InputOutput).files[0].data,
        newId: newMessage.id,
        model: selectedModel as ModelProps,
        provider: selectedProvider as ProviderProps,
        setChats,
        settings: { ...settings, prompt: messages.text },
      });
      await onMessage?.(response, selectedModel!.id);
    });
  };

  const onAddRemoveModelHandler = async (model: string | ModelProps) => {
    addRemoveModel(
      model,
      models,
      setModels as Dispatch<SetStateAction<BaseSender[]>>,
      setChats,
      setSelectedModel as Dispatch<SetStateAction<BaseSender | null>>,
    );
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
              <ChatModelList
                models={models}
                chats={chats}
                selectedModel={selectedModel}
                setSelectedModel={(mId) => {
                  if (!mId) {
                    setSelectedModel(null);
                    return;
                  }
                  const model = models.find((m) => m.id === mId);
                  if (!model) return;
                  setSelectedModel(model);
                }}
                providers={providers}
              />
            )
          }
        />
      }
      messagePane={
        !selectedModel || !selectedProvider ? (
          <EmptyMessagesPane />
        ) : (
          <MessagesPane
            header={
              <MessagesModelHeader
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
            messages={
              <MessageList
                messages={chats[selectedModel.id]}
                avatar={
                  <ModelAvatar providers={providers} sender={selectedModel} />
                }
              />
            }
            input={
              <MessageInputCheck
                provider={selectedProvider!}
                input={
                  <MessageInput
                    disabled={isPending}
                    onSubmit={onMessageHandler}
                    attachment={{
                      accept: "audio/*",
                      multiple: false,
                      disabled: inputState.attachment,
                    }}
                    record={{
                      disabled: inputState.record,
                    }}
                    onInputChange={(d) =>
                      setInputState((prev) => {
                        const res = d.files.length === 1;

                        return prev.attachment !== res
                          ? {
                              attachment: res,
                              record: res,
                            }
                          : prev;
                      })
                    }
                    submit={{
                      disabled: !inputState.attachment,
                    }}
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
