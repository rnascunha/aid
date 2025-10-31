"use client";

import { BouncingLoader } from "@/components/bouncingLoader";
import { ChatContainer } from "@/components/chat/chatContainer";
import { ChatList } from "@/components/chat/chatList";
import ChatsPane from "@/components/chat/chatsPane";
import { MessageList } from "@/components/chat/messageList";
import MessagesPane from "@/components/chat/messagePane";
import MessagesHeader from "@/components/chat/messagesHeader";
import { ChatMessagesProps, ProviderProps } from "@/components/chat/types";
import { useState, useTransition } from "react";
import { AudioInput } from "./components/audioInput";
import { attachmentSubmit } from "@/components/chat/functions";
import { audioToText } from "@/actions/ai/audiototext";
import { AudioToTextOptions, initAudioOptions } from "./data";
import { ChatHeader } from "./components/chatHeader";

interface AudioToTextPros {
  providers: ProviderProps[];
  chats: ChatMessagesProps;
}

export function AudioToText({ providers, chats: allChats }: AudioToTextPros) {
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [chats, setChats] = useState<ChatMessagesProps>(allChats);
  const [opts, setOpts] = useState<AudioToTextOptions>(initAudioOptions);
  const [isPending, startTransition] = useTransition();

  return (
    <ChatContainer
      chatsPane={
        <ChatsPane
          chatHeader={<ChatHeader opts={opts} setOpts={setOpts} />}
          providersList={
            <ChatList
              providers={providers}
              chats={chats}
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
            />
          }
        />
      }
      MessagePane={
        <MessagesPane
          header={<MessagesHeader provider={selectedProvider} />}
          loader={isPending && <BouncingLoader />}
          messages={<MessageList messages={chats[selectedProvider.id]} />}
          input={
            <AudioInput
              opts={opts}
              setOpts={setOpts}
              onSubmit={(file) => {
                if (!file) return;
                const newId = chats[selectedProvider.id].length + 1;
                attachmentSubmit(file, newId, selectedProvider, setChats);
                startTransition(async () => {
                  const res = await fetch(file.data);
                  const blob = await res.blob();
                  const response = await audioToText(
                    selectedProvider.provider,
                    selectedProvider.model,
                    blob,
                    opts
                  );
                  const newIdString2 = `${newId}:r`;
                  setChats((prev) => ({
                    ...prev,
                    [selectedProvider.id]: [
                      ...prev[selectedProvider.id],
                      {
                        id: newIdString2,
                        sender: selectedProvider,
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
