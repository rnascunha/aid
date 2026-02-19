"use client";

import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatHeader } from "@/components/chat/chatHeader";
import { ChatsPane } from "@/components/chat/chatsPane";
import { reducer } from "@/libs/chat/state/functions";
import { useEffect, useReducer, useState } from "react";
import { Actions } from "@/libs/chat/state/types";
import { AgentTrevelerStorageBase } from "@/libs/chat/storage/storageBase";
import {
  BaseSender,
  ChatMessagesProps,
  MessageContentStatus,
  MessageProps,
  TypeMessage,
} from "@/libs/chat/types";
import { InputOutput } from "@/components/chat/input/types";
import { ChatList, EmptyChatList } from "@/components/chat/chatList";
import { EmptyMessagesPane } from "@/components/chat/messagePane/messagePane";
import { MessagesHeader } from "@/components/chat/messagePane/messageHeader";
import { BouncingLoader } from "@/components/bouncingLoader";
import { MessageList } from "@/components/chat/messagePane/messageList";
import { MessageInput } from "@/components/chat/input/messageInput";
import { SessionType as ADKSessionType } from "@/libs/chat/adk/types";
import { AddSession } from "@/components/chat/adk/addSession";
import { SessionOptions } from "@/components/chat/adk/sessionOptions";
import {
  addSession,
  deleteSession,
  // getSessionState,
  sendMessage,
  updateSession,
  updateSessionState,
  // updateSessionState,
} from "@/libs/chat/adk/functions";
import { adk_api_agenttraveler, app_name } from "./constants";
import {
  MessagePaneChat,
  MessagePaneContentTabs,
  MessagePaneState,
  MessagesPaneTabs,
} from "@/components/chat/messagePane/messagePaneTabs";
import { getSessionState } from "./functions";
import { StateType } from "./components/editComponents/types";
import { EditStateTab } from "./components/editStateTab";
import { emptyState } from "./components/editComponents/constants";
import { SessionType } from "./types";

interface AgentTravelerProps {
  sessions: SessionType[];
  chats: ChatMessagesProps;
  user: string;
  storage?: AgentTrevelerStorageBase;
}

export function AgentTraveler({
  chats: initChats,
  sessions: initSessions,
  user,
  storage,
}: AgentTravelerProps) {
  const [state, dispatch] = useReducer(reducer, {
    selected: null,
    sessions: initSessions,
    chats: initChats,
    pending: [],
  });
  const [hasFiles, setHasFiles] = useState(false);
  const [sessionState, setSessionState] = useState<StateType>(
    !state.selected
      ? emptyState
      : structuredClone((state.selected as SessionType).state.state),
  );

  useEffect(() => {
    if (!state.selected) {
      setSessionState(emptyState);
      return;
    }
    setSessionState(
      structuredClone((state.selected as SessionType).state.state),
    );
  }, [state.selected]);

  const onDeleteSession = async (session: SessionType) => {
    await deleteSession(
      {
        sessionId: session.id,
        userId: user,
        app_name: app_name,
      },
      dispatch,
      storage,
    );
  };

  const onEditSession = async <K extends keyof SessionType>(
    session: SessionType,
    field: K,
    value: SessionType[K],
  ) => {
    const newSession = {
      ...session,
      [field]: value,
    };
    await updateSession({ session: newSession }, dispatch, storage);
  };

  const onAddSession = async (name: string = "") => {
    await addSession({ name, state: { state: emptyState } }, dispatch, storage);
  };

  const onGetState = async (session: SessionType) => {
    await getSessionState(
      {
        session,
        userId: user,
      },
      dispatch,
      storage,
    );
  };

  const onUpdateState = async (session: SessionType, state: StateType) => {
    await updateSessionState(
      {
        session,
        app_name,
        user,
        data: state,
      },
      dispatch,
      storage,
    );
  };

  const onSendMessage = async (
    session: SessionType,
    messages: InputOutput | MessageContentStatus,
    type: TypeMessage,
  ) => {
    if (
      type === TypeMessage.MESSAGE &&
      (messages as InputOutput).files.length === 0
    )
      return;

    try {
      await sendMessage(
        {
          sessionId: session.id,
          messages,
          type,
          userId: user,
          url: adk_api_agenttraveler,
          app_name,
        },
        dispatch,
        storage,
      );
    } finally {
      setHasFiles(false);
    }
  };

  const setSelectedSession = (session: SessionType | null) => {
    dispatch({
      action: Actions.SELECT_SESSION,
      sessionId: session?.id ?? null,
    });
  };

  const isPending = state.selected?.id
    ? state.pending.includes(state.selected.id)
    : false;

  return (
    <ChatContainer
      chatHeader={
        <ChatHeader
          chatTitle="Sessions"
          chatOptions={<AddSession onAddSession={onAddSession} />}
        />
      }
      chatsPane={
        <ChatsPane
          modelsList={
            state.sessions.length === 0 ? (
              <EmptyChatList addModelButton={<div></div>} />
            ) : (
              <ChatList
                senders={state.sessions}
                chats={state.chats}
                selectedSender={state.selected}
                setSelectedSender={
                  setSelectedSession as (s: BaseSender | null) => void
                }
              />
            )
          }
        />
      }
      messagePane={
        !state.selected ? (
          <EmptyMessagesPane />
        ) : (
          <MessagesPaneTabs
            header={
              <MessagesHeader
                sender={state.selected}
                options={
                  <SessionOptions
                    session={state.selected as SessionType}
                    onDeleteSession={
                      onDeleteSession as (id: ADKSessionType) => Promise<void>
                    }
                    onEditSession={
                      onEditSession as (
                        id: ADKSessionType,
                        name: keyof ADKSessionType,
                        value: unknown,
                      ) => Promise<void>
                    }
                  />
                }
              />
            }
            content={
              <MessagePaneContentTabs
                tabs={[
                  {
                    label: "Chat",
                    panel: (
                      <MessagePaneChat
                        loader={isPending && <BouncingLoader />}
                        messages={
                          <MessageList
                            messages={
                              state.chats[state.selected.id] as MessageProps[]
                            }
                          />
                        }
                        input={
                          <MessageInput
                            onSubmit={(value, type) =>
                              onSendMessage(
                                state.selected as SessionType,
                                value,
                                type,
                              )
                            }
                            submit={{
                              disabled: !hasFiles,
                            }}
                            onInputChange={(data) =>
                              setHasFiles(data.files.length !== 0)
                            }
                            disabled={isPending}
                            attachment={{
                              multiple: true,
                              accept: "application/pdf,text/pdf,image/*",
                            }}
                            record={false}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: "State",
                    panel: (
                      <MessagePaneState
                        state={(state.selected as SessionType).state}
                        onGetState={() =>
                          onGetState(state.selected as SessionType)
                        }
                        onUpdateState={() =>
                          onUpdateState(
                            state.selected as SessionType,
                            sessionState,
                          )
                        }
                      />
                    ),
                  },
                  {
                    label: "Data",
                    panel: (
                      <EditStateTab
                        state={sessionState}
                        original={
                          (state.selected as SessionType).state
                            .state as StateType
                        }
                        setState={setSessionState}
                      />
                    ),
                  },
                ]}
              />
            }
          />
        )
      }
    />
  );
}
