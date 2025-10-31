"use client";

import { BouncingLoader } from "@/components/bouncingLoader";
import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatList } from "@/components/chat/chatList";
import ChatsPane from "@/components/chat/chatsPane";
import { MessageList } from "@/components/chat/messageList";
import MessagesPane from "@/components/chat/messagePane";
import MessagesHeader from "@/components/chat/messagesHeader";
import { ChatMessagesProps, ModelProps } from "@/components/chat/types";
import { useState, useTransition } from "react";
import { AudioInput } from "./components/audioInput";
import { attachmentSubmit } from "@/components/chat/functions";
import { audioToText } from "@/actions/ai/audiototext";
import { AudioToTextOptions, initAudioOptions } from "./data";
import { ChatHeader } from "./components/chatHeader";
import { providerMap } from "../chat/data";

interface AudioToTextPros {
  models: ModelProps[];
  chats: ChatMessagesProps;
}

export function AudioToText({ models, chats: allChats }: AudioToTextPros) {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [chats, setChats] = useState<ChatMessagesProps>(allChats);
  const [opts, setOpts] = useState<AudioToTextOptions>(initAudioOptions);
  const [isPending, startTransition] = useTransition();

  return (
    <ChatContainer
      chatsPane={
        <ChatsPane
          chatHeader={<ChatHeader opts={opts} setOpts={setOpts} />}
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
          header={<MessagesHeader model={selectedModel} />}
          loader={isPending && <BouncingLoader />}
          messages={<MessageList messages={chats[selectedModel.id]} />}
          input={
            <AudioInput
              opts={opts}
              setOpts={setOpts}
              onSubmit={(file) => {
                if (!file) return;
                const newId = chats[selectedModel.id].length + 1;
                attachmentSubmit(file, newId, selectedModel, setChats);
                startTransition(async () => {
                  const res = await fetch(file.data);
                  const blob = await res.blob();
                  const response = await audioToText(
                    providerMap[selectedModel.providerId].provider,
                    selectedModel.model,
                    blob,
                    opts
                  );
                  const newIdString2 = `${newId}:r`;
                  setChats((prev) => ({
                    ...prev,
                    [selectedModel.id]: [
                      ...prev[selectedModel.id],
                      {
                        id: newIdString2,
                        sender: selectedModel,
                        content: response,
                        timestamp: Date.now(),
                      },
                    ],
                  }));
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
