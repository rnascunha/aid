from pydantic import BaseModel, Field
from pydantic.types import PositiveInt
from typing import List, Literal, Dict

import aisuite as ai

import ai_tools as tools
from provider import providerChatIds


class MessagesContext(BaseModel):
    role: Literal["system", "assistant", "user"]
    content: str


class SettingsValidate(BaseModel):
    temperature: float
    tools: List[Literal["get_current_datetime"]]
    maxTurns: PositiveInt


class ChatInputValidate(BaseModel):
    provider: Literal[*providerChatIds]  # type: ignore
    model: str = Field(min_length=1)
    messages: List[MessagesContext]
    settings: SettingsValidate
    auth: Dict[str, str]


def runChat(provider: str, model: str, messages, settings: dict):
    """Running chat request to provider"""

    importedTools = [getattr(tools, t) for t in settings["tools"]]

    client = ai.Client()
    response = client.chat.completions.create(
        model=f"{provider}:{model}",
        messages=messages,
        tools=importedTools,
        temperature=settings["temperature"],
        max_turns=settings["maxTurns"],
    )

    return response.choices[0].message.content
