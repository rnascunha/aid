from fastapi import FastAPI
from chat import runChat, ChatInputValidate
from provider import setProviderAuth
from audiototext import runAudioToText, AudioToTextValidate
from lib import base64_to_bytesio

app = FastAPI()


@app.post("/chat/")
def chatRequest(input: ChatInputValidate):
    try:
        data = input.model_dump()

        try:
            setProviderAuth(data["provider"], data["auth"])
        except Exception as e:
            return {
                "code": 13,
                "error": "Provider Auth Error",
                "detail": str(e),
            }

        response = runChat(
            data["provider"], data["model"], data["messages"], data["settings"]
        )
        return {"success": True, "response": response}
    except Exception as e:
        return {
            "code": 5,
            "error": "Error running chat request",
            "detail": str(e),
        }


@app.post("/audiototext/")
def audioToTextRequest(input: AudioToTextValidate):
    try:
        data = input.model_dump()

        try:
            setProviderAuth(data["provider"], data["auth"])
        except Exception as e:
            return {
                "code": 13,
                "error": "Provider Auth Error",
                "detail": str(e),
            }

        file = base64_to_bytesio(data["file"])
        response = runAudioToText(
            data["provider"], data["model"], file, data["settings"]
        )
        return {"success": True, "response": response}
    except Exception as e:
        return {
            "code": 5,
            "error": "Error running chat request",
            "detail": str(e),
        }
