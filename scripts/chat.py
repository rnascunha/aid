from pydantic import BaseModel, Field
from pydantic.types import PositiveInt
from typing import List, Literal, Dict

import aisuite as ai

from ai_tools import toolList, toolMap
from provider import providerChatIds, setProviderAuth
from exception import RunClientAIException, ProviderAuthException

import tempfile


class MessagesContext(BaseModel):
    role: Literal["system", "assistant", "user"]
    content: str


class SettingsValidate(BaseModel):
    temperature: float
    tools: List[Literal[*toolList]]  # type: ignore
    maxTurns: PositiveInt


class ToolInfoValidate(BaseModel):
    ip: str
    geoLocationApiKey: str


class ChatInfo(BaseModel):
    tool: ToolInfoValidate


class ChatInputValidate(BaseModel):
    provider: Literal[*providerChatIds]  # type: ignore
    model: str = Field(min_length=1)
    messages: List[MessagesContext]
    settings: SettingsValidate
    auth: Dict[str, str]
    info: ChatInfo


def runChat(provider: str, model: str, messages, settings: dict, info: dict[str, any]):
    """Running chat request to provider"""

    try:
        importedTools = [toolMap[t](info["tool"]) for t in settings["tools"]]

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
        info = input["info"]
        response = runChat(provider, model, messages, settings, info)
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
    info = input["info"]
    response = runChat(provider, model, messages, settings, info)
    # response = {"choices": [{"message": {"content": "This is a test message"}}]}
    return {
        "success": True,
        "data": response,
    }
