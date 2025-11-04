from fastapi import FastAPI
from chat import runChat, ChatInputValidate
from audiototext import runAudioToText, AudioToTextFileValidate
from lib import base64_to_bytesio

app = FastAPI()


@app.post("/chat/")
def chatRequest(input: ChatInputValidate):
    try:
        data = input.model_dump()
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
def audioToTextRequest(input: AudioToTextFileValidate):
    try:
        data = input.model_dump()
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
