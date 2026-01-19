import { MessageProps, ToolsProps } from "@/libs/chat/types";
import { ChatSettings } from "./types";
import { mergeMessages } from "@/libs/chat/functions";
import { fetchChatRequest } from "@/actions/ai/chat";
import { providerBaseMap } from "@/libs/chat/models/data";
import { toolsMap } from "./data";
import { ModelProps, ProviderProps } from "@/libs/chat/models/types";

export async function messageResponse(
  message: string,
  newId: string,
  model: ModelProps,
  provider: ProviderProps,
  settings: ChatSettings,
  chats: MessageProps[],
  toolInfo: ToolsProps,
) {
  const messages = mergeMessages(message, settings.context, chats);

  const response = await fetchChatRequest({
    provider: providerBaseMap[provider.providerBaseId].provider,
    model: model.model,
    messages,
    settings: {
      ...settings.general,
      ...{
        ...settings.tools,
        tools: settings.tools.tools.filter(
          (f) =>
            toolsMap[f].validade?.(f, toolInfo, settings.tools.tools).allowed ??
            true,
        ),
      },
    },
    info: { tool: toolInfo },
    auth: provider.auth,
    config: provider.config,
  });
  const newIdString = `${newId}:r`;
  const newMessage: MessageProps = {
    id: newIdString,
    origin: "received",
    senderId: model.id,
    timestamp: Date.now(),
    type: response.type,
    raw: response.raw,
    content: response.content,
  } as MessageProps;

  return newMessage;
}

// export async function messageResponse(
//   message: string,
//   newId: string,
//   model: ModelProps,
//   provider: ProviderProps,
//   setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
//   settings: ChatSettings,
//   chats: MessageProps[],
//   toolInfo: ToolsProps
// ) {
//   const messages = mergeMessages(message, settings.context, chats);

//   const response = await fetchChatRequest({
//     provider: providerBaseMap[provider.providerBaseId].provider,
//     model: model.model,
//     messages,
//     settings: {
//       ...settings.general,
//       ...{
//         ...settings.tools,
//         tools: settings.tools.tools.filter(
//           (f) =>
//             toolsMap[f].validade?.(f, toolInfo, settings.tools.tools).allowed ??
//             true
//         ),
//       },
//     },
//     info: { tool: toolInfo },
//     auth: provider.auth,
//     config: provider.config,
//   });
//   const newIdString = `${newId}:r`;
//   const newMessage: MessageProps = {
//     id: newIdString,
//     origin: "received",
//     senderId: model.id,
//     timestamp: Date.now(),
//     type: response.type,
//     raw: response.raw,
//     content: response.content,
//   } as MessageProps;

//   setChats((prev) => ({
//     ...prev,
//     [model.id]: [...prev[model.id], newMessage],
//   }));
//   return newMessage;
// }
