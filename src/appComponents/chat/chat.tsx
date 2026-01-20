"use client";

import { useContext, useEffect, useMemo, useReducer, useState } from "react";
import { Stack } from "@mui/material";

import { SettingsDialog } from "./components/settingsDialog";
import { ChatSettings } from "@/appComponents/chat/types";

import { removeModelsFromRemovedProviders } from "@/libs/chat/models/functions";
import { sendMessageHandler } from "@/libs/chat/functions";

import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatsPane } from "@/components/chat/chatsPane";
import { ChatModelList } from "@/components/chat/model/chatList";
import { EmptyMessagesPane, MessagesPane } from "@/components/chat/messagePane";
import { MessageInput } from "@/components/chat/input/messageInput";
import { MessagesModelHeader } from "@/components/chat/model/messagesHeader";
import { BouncingLoader } from "@/components/bouncingLoader";
import { MessageList } from "@/components/chat/messageList";
import { ChatHeader } from "@/components/chat/chatHeader";
import { DeleteMessagesButton } from "@/components/chat/deleteMessagesButton";
import { AddModel, AddModelButton } from "@/components/chat/model/addModel";

import { aIContext } from "@/components/chat/context";
import { providerBaseMap } from "@/libs/chat/models/data";
import ModelAvatar, {
  MessageInputCheck,
} from "@/components/chat/model/components";
import { ModelProps } from "@/libs/chat/models/types";
import {
  ChatMessagesProps,
  MessageContentStatus,
  MessageProps,
  TypeMessage,
} from "@/libs/chat/types";
import { EmptyChatList } from "@/components/chat/chatList";
import { messageResponse } from "./functions";
import { InputOutput } from "@/components/chat/input/types";
import { reducer } from "@/libs/chat/state/functions";
import { Actions } from "@/libs/chat/state/types";
import { MultipleMessage } from "@/components/chat/input/multipleMessages";

export interface ChatProps {
  models: ModelProps[];
  chats: ChatMessagesProps;
  settings: ChatSettings;
  onMessage?: (
    message: MessageProps,
    contactId: string,
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
  const [state, dispatch] = useReducer(reducer, {
    chats: allChats,
    sessions: allModels,
    selected: null,
    pending: [],
  });
  const [settings, setSettings] = useState(initSettings);

  const { providers, tools } = useContext(aIContext);
  const chatProviders = useMemo(() => {
    const cp = providers.filter((p) =>
      providerBaseMap[p.providerBaseId].type.includes("chat"),
    );
    // Remove models from removed providers
    removeModelsFromRemovedProviders(
      cp,
      state.sessions as ModelProps[],
      async (mId) => {
        dispatch({ action: Actions.DELETE_SESSION, sessionId: mId });
        await onAddRemoveModel?.(mId);
      },
    );
    return cp;
  }, [providers, state.sessions, onAddRemoveModel]);

  const setSelectedModel = (modelId: string | null) => {
    dispatch({ action: Actions.SELECT_SESSION, sessionId: modelId });
  };

  // Get provider from selected model
  const selectedProvider = !state.selected
    ? undefined
    : chatProviders.find(
        (p) => p.id === (state.selected as ModelProps | null)?.providerId,
      );

  // Check if selected model still exist
  if (
    state.selected &&
    !chatProviders.find(
      (p) => p.id === (state.selected as ModelProps | null)?.providerId,
    )
  ) {
    setSelectedModel(null);
  }

  useEffect(() => {
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  const sendMessage = async (
    session: ModelProps,
    messages: InputOutput | MessageContentStatus,
    type: TypeMessage,
  ) => {
    if (type === TypeMessage.MESSAGE && !(messages as InputOutput).text.trim())
      return;

    const newMessage = sendMessageHandler(messages, type, session.id);
    dispatch({
      action: Actions.ADD_MESSAGE,
      message: newMessage,
      sessionId: session.id,
    });

    await onMessage?.(newMessage, session.id);
    if (newMessage.type !== TypeMessage.MESSAGE) return;

    dispatch({ action: Actions.ADD_PENDING, sessionId: session.id });
    try {
      const response = await messageResponse(
        messages.text,
        newMessage.id,
        session,
        selectedProvider!,
        settings,
        state.chats[session.id],
        tools,
      );
      dispatch({
        action: Actions.ADD_MESSAGE,
        message: response,
        sessionId: session.id,
      });
      await onMessage?.(response, session.id);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ action: Actions.REMOVE_PENDING, sessionId: session.id });
    }
  };

  const onDeleteAllMessagesHandler = async () => {
    dispatch({ action: Actions.DELETE_ALL_MESSAGES });
    await onDeleteMessages?.();
  };
  const onDeleteModelMessagesHandler = async (modelId: string) => {
    dispatch({
      action: Actions.DELETE_ALL_SENDER_MESSAGES,
      sessionId: modelId,
    });
    await onDeleteMessages?.(modelId);
  };
  const onAddRemoveModelHandler = async (model: string | ModelProps) => {
    if (typeof model === "string")
      dispatch({ action: Actions.DELETE_SESSION, sessionId: model });
    else dispatch({ action: Actions.ADD_SESSION, session: model });
    await onAddRemoveModel?.(model);
  };

  const models = state.sessions as ModelProps[];
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
                models={models}
                addRemoveModel={onAddRemoveModelHandler}
                providers={chatProviders}
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
                    models={state.sessions as ModelProps[]}
                    addRemoveModel={onAddRemoveModelHandler}
                    providers={chatProviders}
                  />
                }
              />
            ) : (
              <ChatModelList
                models={state.sessions as ModelProps[]}
                chats={state.chats}
                selectedModel={state.selected as ModelProps}
                setSelectedModel={setSelectedModel}
                // providers={providers}
                providers={chatProviders}
              />
            )
          }
        />
      }
      messagePane={
        !(state.selected as ModelProps) || !selectedProvider ? (
          <EmptyMessagesPane />
        ) : (
          <MessagesPane
            key={state.selected!.id}
            header={
              <MessagesModelHeader
                model={state.selected as ModelProps}
                provider={selectedProvider}
                options={
                  <DeleteMessagesButton
                    onDelete={async () =>
                      await onDeleteModelMessagesHandler(state.selected!.id)
                    }
                  />
                }
              />
            }
            loader={isPending && <BouncingLoader />}
            messages={
              <MessageList
                messages={state.chats[state.selected!.id]}
                avatar={
                  <ModelAvatar
                    sender={state.selected as ModelProps}
                    // providers={providers}
                    providers={chatProviders}
                  />
                }
              />
            }
            input={
              <MessageInputCheck
                provider={selectedProvider!}
                input={
                  <MessageInput
                    onSubmit={(value, type) =>
                      sendMessage(state.selected as ModelProps, value, type)
                    }
                    disabled={isPending}
                    attachment={false}
                    record={false}
                    otherOptions={(value, clear, disabled) => (
                      <MultipleMessage
                        disabled={disabled || state.sessions.length < 2}
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
