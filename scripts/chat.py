from pydantic import BaseModel, Field
from pydantic.types import PositiveInt
from typing import List, Literal, Dict, Optional, Union

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
    config: Optional[Dict[str, Union[str, int]]] = None
    auth: Optional[Dict[str, str]] = None
    info: ChatInfo


def runChat(input):
    """Running chat request to provider"""

    try:
        provider = input["provider"]
        model = input["model"]
        messages = input["messages"]
        settings = input["settings"]
        info = input["info"]
        config = {provider: input["config"]} if input["config"] else dict()

        importedTools = [toolMap[t](info["tool"]) for t in settings["tools"]]

        client = ai.Client(config)
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
        response = runChat(input)
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

    response = runChat(input)
    # response = {"choices": [{"message": {"content": "This is a test message"}}]}
    return {
        "success": True,
        "data": response,
    }
