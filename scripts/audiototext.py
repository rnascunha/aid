from pydantic import BaseModel, Field
from typing import Literal, Dict
from provider import providerAudioToTextIds

import aisuite as ai


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

    client = ai.Client()
    result = client.audio.transcriptions.create(
        model=f"{provider}:{model}",
        file=file,
        language=settings["language"],
        prompt=settings["prompt"],
        temperature=settings["temperature"],
    )

    return result.text
