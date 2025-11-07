from pydantic import BaseModel, Field
from typing import Literal, Dict
from provider import providerAudioToTextIds, setProviderAuth

import aisuite as ai
from exception import RunClientAIException
from lib import base64_to_bytesio


class SettingsValidate(BaseModel):
    temperature: float
    language: str
    prompt: str


class AudioToTextValidate(BaseModel):
    provider: Literal[*providerAudioToTextIds]  # type: ignore
    model: str = Field(min_length=1)
    settings: SettingsValidate
    file: str
    auth: Dict[str, str]


def runAudioToText(provider: str, model: str, file: str, settings: dict):
    """Convert audio file to text"""

    try:
        client = ai.Client()
        result = client.audio.transcriptions.create(
            model=f"{provider}:{model}",
            file=file,
            language=settings["language"],
            prompt=settings["prompt"],
            temperature=settings["temperature"],
        )

        return result.text
    except Exception as e:
        raise RunClientAIException(str(e))


def runAudioToTextApp(input):
    provider = input["provider"]
    auth = input["auth"]
    setProviderAuth(provider, auth)

    model = input["model"]
    settings = input["settings"]
    file = base64_to_bytesio(input["file"])
    response = runAudioToText(provider, model, file, settings)
    return {"success": True, "response": response}
