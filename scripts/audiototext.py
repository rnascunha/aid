import sys
import json
from dotenv import load_dotenv
import aisuite as ai

from pydantic import BaseModel, Field
from typing import Literal

load_dotenv("./scripts/.env")


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


def runAppAudioToText(file: str, input):
    check = check_arguments(input)
    if "error" in check:
        return check

    try:
        provider = check["provider"]
        model = check["model"]
        settings = check["settings"]

        response = runAudioToText(provider, model, file, settings)
        return {"success": True, "response": response}
    except Exception as e:
        return {
            "code": 5,
            "error": "Error running chat request",
            "detail": str(e),
        }


if __name__ == "__main__":
    if len(sys.argv) == 5:
        response = {
            "code": 1,
            "error": "Wrong number of arguments",
            "detail": "Argument must be: <provider> <model> <file_path> <settings>",
        }
        json_out = json.dumps(response)
        print(json_out, end=None)
        sys.exit(1)

    response = runAppAudioToText(
        sys.argv[3],
        {"provider": sys.argv[1], "model": sys.argv[2], "settings": sys.argv[4]},
    )
    json_out = json.dumps(response)
    print(json_out, end=None)
    if "error" in response:
        sys.exit(response["code"])
