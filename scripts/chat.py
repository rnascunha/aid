from pydantic import BaseModel, Field
from pydantic.types import PositiveInt
from typing import List, Literal, Dict

import aisuite as ai

import ai_tools as tools
from provider import providerChatIds, setProviderAuth
from exception import RunClientAIException, ProviderAuthException

import tempfile


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

    try:
        importedTools = [getattr(tools, t) for t in settings["tools"]]

        client = ai.Client()
        response = client.chat.completions.create(
            model=f"{provider}:{model}",
            messages=messages,
            tools=importedTools,
            temperature=settings["temperature"],
            max_turns=settings["maxTurns"],
        )

        return response
    except Exception as e:
        raise RunClientAIException(str(e))


def runChatAppGoogle(input):
    provider = input["provider"]
    auth = input["auth"]
    if "application_credentials" not in auth:
        raise ProviderAuthException(f"Missing 'application_credentials' auth field")

    data = auth["application_credentials"]
    with tempfile.NamedTemporaryFile(mode="w+", delete=True) as temp_file:
        auth["application_credentials"] = temp_file.name
        temp_file.write(data)
        temp_file.seek(0)

        setProviderAuth(provider, auth)

        model = input["model"]
        messages = input["messages"]
        settings = input["settings"]
        response = runChat(provider, model, messages, settings)
        return {
            "success": True,
            "data": response,
        }


def runChatApp(input):
    provider = input["provider"]
    if provider == "google":
        return runChatAppGoogle(input)
    auth = input["auth"]
    setProviderAuth(provider, auth)

    model = input["model"]
    messages = input["messages"]
    settings = input["settings"]
    response = runChat(provider, model, messages, settings)
    return {
        "success": True,
        "data": response,
    }
