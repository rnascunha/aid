from fastapi import FastAPI
from chat import runChat, ChatInputValidate

app = FastAPI()


@app.post("/chat/")
def chatRequest(input: ChatInputValidate):
    try:
        data = input.dict()
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
