import sys
import json
import aisuite as ai

from pydantic import BaseModel, Field
from typing import Literal


class SettingsValidate(BaseModel):
    temperature: float
    language: str
    prompt: str


class AudioToTextValidate(BaseModel):
    provider: Literal["openai", "google", "deepgram", "huggingface"]
    model: str = Field(min_length=1)
    settings: SettingsValidate


class AudioToTextFileValidate(AudioToTextValidate):
    file: str


def check_arguments(arg):
    try:
        data = json.loads(arg)
        AudioToTextValidate(**data)
        return data
    except Exception as e:
        return {
            "code": 2,
            "error": "Error parsing inputs",
            "detail": str(e),
        }


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
