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
  ChatMessagesProps,
  MessageContentStatus,
  TypeMessage,
} from "@/libs/chat/types";
import { useContext, useEffect, useMemo, useReducer, useState } from "react";

import { sendMessageHandler } from "@/libs/chat/functions";
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
import { reducer } from "@/libs/chat/state/functions";
import { Actions } from "@/libs/chat/state/types";
import { MultipleMessage } from "@/components/chat/input/multipleMessages";
import { AudioToTextStorageBase } from "@/libs/chat/storage/storageBase";

interface AudioToTextPros {
  models: ModelProps[];
  chats: ChatMessagesProps;
  settings: AudioToTextSettings;
  storage?: AudioToTextStorageBase;
}

interface InputState {
  attachment: boolean;
  record: boolean;
}

export function AudioToText({
  models: allModel,
  chats: allChats,
  settings: initSettings,
  storage,
}: AudioToTextPros) {
  const [state, dispatch] = useReducer(reducer, {
    selected: null,
    chats: allChats,
    sessions: allModel,
    pending: [],
  });
  const [settings, setSettings] = useState<AudioToTextSettings>(initSettings);
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
    removeModelsFromRemovedProviders(
      cp,
      state.sessions as ModelProps[],
      async (mId) => {
        dispatch({ action: Actions.DELETE_SESSION, sessionId: mId });
        await storage?.deleteSender(mId);
      },
    );
    return cp;
  }, [providers, state.sessions, storage]);

  const setSelectedModel = (modelId: string | null) => {
    dispatch({ action: Actions.SELECT_SESSION, sessionId: modelId });
  };

  // Get provider from selected model
  const selectedProvider = !state.selected
    ? null
    : audioToTextProviders.find(
        (p) => p.id === (state.selected as ModelProps).providerId,
      );

  // Check if selected model still exist
  if (
    (state.selected as ModelProps) &&
    !audioToTextProviders.find(
      (p) => p.id === (state.selected as ModelProps).providerId,
    )
  ) {
    setSelectedModel(null);
  }

  useEffect(() => {
    storage?.updateSettings(settings);
  }, [settings, storage]);

  const sendMessage = async (
    session: ModelProps,
    messages: InputOutput | MessageContentStatus,
    type: TypeMessage,
  ) => {
    if (type === TypeMessage.MESSAGE && !((messages as InputOutput).files.length > 0))
      return;

    console.log(messages);
    const newMessage = sendMessageHandler(messages, type, session.id);
    dispatch({
      action: Actions.ADD_MESSAGE,
      message: newMessage,
      sessionId: session.id,
    });

    await storage?.addMessage(newMessage);
    if (newMessage.type !== TypeMessage.MESSAGE) return;

    dispatch({ action: Actions.ADD_PENDING, sessionId: session.id });
    try {
      const response = await attachmentResponse({
        data: (messages as InputOutput).files[0].data,
        newId: newMessage.id,
        model: session as ModelProps,
        provider: selectedProvider as ProviderProps,
        settings: { ...settings, prompt: messages.text },
      });
      dispatch({
        action: Actions.ADD_MESSAGE,
        message: response,
        sessionId: session.id,
      });
      await storage?.addMessage(response);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ action: Actions.REMOVE_PENDING, sessionId: session.id });
    }
  };

  const onAddRemoveModelHandler = async (model: string | ModelProps) => {
    if (typeof model === "string") {
      dispatch({ action: Actions.DELETE_SESSION, sessionId: model });
      await storage?.deleteSender(model);
    } else {
      dispatch({ action: Actions.ADD_SESSION, session: model });
      await storage?.addSender(model);
    }
  };

  const onDeleteAllMessagesHandler = async () => {
    dispatch({ action: Actions.DELETE_ALL_MESSAGES });
    await storage?.deleteAllMessages();
  };
  const onDeleteModelMessagesHandler = async (modelId: string) => {
    dispatch({
      action: Actions.DELETE_ALL_SENDER_MESSAGES,
      sessionId: modelId,
    });
    await storage?.deleteSenderMessages(modelId);
  };

  const isPending = state.selected?.id
    ? state.pending.includes(state.selected.id)
    : false;

  return (
    <ChatContainer
      chatHeader={
        <ChatHeader
          chatOptions={
            <Stack direction="row" gap={0.5}>
              <AddModel
                models={state.sessions as ModelProps[]}
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
            state.sessions.length === 0 ? (
              <EmptyChatList
                addModelButton={
                  <AddModelButton
                    models={state.sessions as ModelProps[]}
                    addRemoveModel={onAddRemoveModelHandler}
                    providers={audioToTextProviders}
                  />
                }
              />
            ) : (
              <ChatModelList
                models={state.sessions as ModelProps[]}
                chats={state.chats}
                selectedModel={state.selected as ModelProps}
                setSelectedModel={(mId) => {
                  if (!mId) {
                    setSelectedModel(null);
                    return;
                  }
                  const model = state.sessions.find((m) => m.id === mId);
                  if (!model) return;
                  setSelectedModel((model as ModelProps).id);
                }}
                providers={providers}
              />
            )
          }
        />
      }
      messagePane={
        !state.selected || !selectedProvider ? (
          <EmptyMessagesPane />
        ) : (
          <MessagesPane
            header={
              <MessagesModelHeader
                model={state.selected as ModelProps}
                provider={selectedProvider}
                options={
                  <DeleteMessagesButton
                    onDelete={async () =>
                      await onDeleteModelMessagesHandler(
                        (state.selected as ModelProps).id,
                      )
                    }
                  />
                }
              />
            }
            loader={isPending && <BouncingLoader />}
            messages={
              <MessageList
                messages={state.chats[state.selected.id]}
                avatar={
                  <ModelAvatar
                    providers={providers}
                    sender={state.selected as ModelProps}
                  />
                }
              />
            }
            input={
              <MessageInputCheck
                provider={selectedProvider!}
                input={
                  <MessageInput
                    disabled={isPending}
                    onSubmit={async (value, type) => {
                      await sendMessage(
                        state.selected as ModelProps,
                        value,
                        type,
                      );
                      setInputState({
                        attachment: false,
                        record: false,
                      });
                    }}
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
                    otherOptions={(value, clear, disabled) => (
                      <MultipleMessage
                        disabled={
                          disabled ||
                          isPending ||
                          state.sessions.length < 2 ||
                          !inputState.attachment
                        }
                        sessions={state.sessions}
                        sendMessage={async (session) => {
                          clear();
                          await sendMessage(
                            session as ModelProps,
                            value,
                            TypeMessage.MESSAGE,
                          );
                        }}
                      />
                    )}
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
