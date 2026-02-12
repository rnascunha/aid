import {
  Part,
  PartFunctionCall,
  PartFunctionResponse,
  PartText,
  PartType,
} from "@/libs/chat/types";

import { ChatCompletionResponse, ChatMessage } from "./types";

function getFunctionArgs(args: string) {
  try {
    return JSON.parse(args);
  } catch {
    return {
      error: "Error parsing",
      arguments: args,
    };
  }
}

function getToolCall(message: ChatMessage): PartFunctionCall[] | undefined {
  if (!message.tool_calls || message.tool_calls.length === 0) return;

  return message.tool_calls.reduce((acc, c) => {
    const cc: PartFunctionCall = {
      id: c.id,
      name: c.function.name,
      args: getFunctionArgs(c.function.arguments),
    };
    acc.push(cc);
    return acc;
  }, [] as PartFunctionCall[]);
}

function getAllToolCalls(messages: ChatMessage[]) {
  return messages.reduce((acc, c) => {
    const call = getToolCall(c);
    if (call) acc.push(...call);
    return acc;
  }, [] as PartFunctionCall[]);
}

function getToolResponse(
  toolId: string,
  messages: ChatMessage[],
): PartFunctionResponse | undefined {
  const tool = messages.find((f) => f.tool_call_id === toolId);
  if (!tool) return;
  return {
    id: toolId,
    name: tool.name,
    response: { content: tool.content },
  } as PartFunctionResponse;
}

function getToolCallsResponse(messages: ChatMessage[]) {
  const calls = getAllToolCalls(messages);
  return calls.reduce(
    (acc, call) => {
      const response = getToolResponse(call.id, messages);
      acc.push([call, response]);
      return acc;
    },
    [] as [PartFunctionCall, PartFunctionResponse | undefined][],
  );
}

function toolCallsResponseParts(
  tools: [PartFunctionCall, PartFunctionResponse | undefined][],
) {
  return tools.reduce((acc, [c, r]) => {
    acc.push({
      [PartType.FUNCTION_CALL]: c,
    });
    if (r)
      acc.push({
        [PartType.FUNCTION_RESPONSE]: r,
      });
    return acc;
  }, [] as Part[]);
}

function getMessageContent(chatResponse: ChatCompletionResponse): PartText {
  return chatResponse.choices[0].message.content as PartText;
}

export function getResponseParts(chatResponse: ChatCompletionResponse): Part[] {
  //Tools;
  const intermediate_messages =
    chatResponse.choices[0].intermediate_messages ?? [];
  const toolsCalls = toolCallsResponseParts(
    getToolCallsResponse(intermediate_messages),
  );

  const content = getMessageContent(chatResponse);

  return [
    ...toolsCalls,
    {
      [PartType.TEXT]: content,
    },
  ] as Part[];
}
