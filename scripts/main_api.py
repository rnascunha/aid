from fastapi import FastAPI
from chat import runChatApp, ChatInputValidate
from audiototext import runAudioToTextApp, AudioToTextValidate
from pydantic import ValidationError

from exception import (
    RunClientAIException,
    ProviderException,
    ProviderAuthException,
    AIdException,
)

app = FastAPI()


@app.post("/chat/")
def chatRequest(input: ChatInputValidate):
    try:
        data = input.model_dump()
        return runChatApp(data)
    except (
        ProviderException,
        ProviderAuthException,
        RunClientAIException,
        AIdException,
    ) as pe:
        return pe.json()
    except ValidationError as ve:
        return {"code": 50, "error": "Input Validation Error", "detail": str(ve)}
    except Exception as e:
        return {"code": 52, "errot": "Fetch Error", "detail": str(e)}


@app.post("/audiototext/")
def audioToTextRequest(input: AudioToTextValidate):
    try:
        data = input.model_dump()
        return runAudioToTextApp(data)
    except (
        ProviderException,
        ProviderAuthException,
        RunClientAIException,
        AIdException,
    ) as pe:
        return pe.json()
    except ValidationError as ve:
        return {"code": 50, "error": "Input Validation Error", "detail": str(ve)}
    except Exception as e:
        return {"code": 52, "errot": "Fetch Error", "detail": str(e)}
    