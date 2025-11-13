from pydantic import BaseModel, Field
from typing import Literal, Dict, Optional, Union
from provider import providerAudioToTextIds, setProviderAuth

import aisuite as ai
from exception import RunClientAIException, ProviderAuthException
from lib import base64_to_bytesio
import tempfile


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
    config: Optional[Dict[str, Union[str, int]]] = dict()


def runAudioToText(input):
    """Convert audio file to text"""

    try:
        provider = input["provider"]
        model = input["model"]
        settings = input["settings"]
        file = base64_to_bytesio(input["file"])
        config = {provider: input["config"]} if input["config"] else dict()

        client = ai.Client(config)
        result = client.audio.transcriptions.create(
            model=f"{provider}:{model}",
            file=file,
            language=settings["language"],
            prompt=settings["prompt"],
            temperature=settings["temperature"],
        )

        return result
    except Exception as e:
        raise RunClientAIException(str(e))


def runAudioToTextAppGoogle(input):
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

        response = runAudioToText(input)
        return {"success": True, "data": response}


def runAudioToTextApp(input):
    provider = input["provider"]
    auth = input["auth"]
    setProviderAuth(provider, auth)

    response = runAudioToText(input)
    return {"success": True, "data": response}
