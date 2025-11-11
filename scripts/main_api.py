from fastapi import FastAPI, Request, status
from chat import runChatApp, ChatInputValidate
from audiototext import runAudioToTextApp, AudioToTextValidate
from pydantic import ValidationError
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import json

from exception import (
    RunClientAIException,
    ProviderException,
    ProviderAuthException,
    AIdException,
)

app = FastAPI()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "code": 422,
            "error": "Invalid Data Provided",
            "detail": json.dumps(exc.errors()),
        },
    )


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
        return {"code": 52, "error": "Fetch Error", "detail": str(e)}


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
        return {"code": 52, "error": "Fetch Error", "detail": str(e)}
