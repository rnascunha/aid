import sys
import json

from dotenv import load_dotenv
import aisuite as ai
import ai_tools as tools

from pydantic import BaseModel, Field
from pydantic.types import PositiveInt
from typing import List, Literal


load_dotenv("./scripts/.env")


class MessagesContext(BaseModel):
    role: Literal["system", "assistant", "user"]
    content: str


class SettingsValidate(BaseModel):
    temperature: float
    tools: List[Literal["get_current_datetime"]]
    maxTurns: PositiveInt


class ChatInputValidate(BaseModel):
    provider: Literal[
        "openai",
        "anthropic",
        "google",
        "mistral",
        "groq",
        "cohere",
        "ollama",
        "cerebras",
        "sambanova",
        "watsonx",
        "deepseek",
        "nebius",
        "xai",
    ]
    model: str = Field(min_length=1)
    messages: List[MessagesContext]
    settings: SettingsValidate


def check_arguments(arg):
    try:
        data = json.loads(arg)
        ChatInputValidate(**data)
        return data
    except Exception as e:
        return {
            "code": 2,
            "error": "Error parsing inputs",
            "detail": str(e),
        }


def runChat(provider, model, messages, settings):
    """Running chat request to provider"""

    importedTools = [getattr(tools, t) for t in settings["tools"]]

    client = ai.Client()

    response = client.chat.completions.create(
        model=f"{provider}:{model}",
        messages=messages,
        tools=importedTools,
        temperature=settings["temperature"],
        max_turns=2,
    )

    return response.choices[0].message.content


def runAppChat(input):
    check = check_arguments(input)
    if "error" in check:
        return check

    try:
        provider = check["provider"]
        model = check["model"]
        messages = check["messages"]
        settings = check["settings"]

        response = runChat(provider, model, messages, settings)
        return {"success": True, "response": response}
    except Exception as e:
        return {
            "code": 5,
            "error": "Error running chat request",
            "detail": str(e),
        }


if __name__ == "__main__":
    if len(sys.argv) != 2:
        response = {
            "code": 1,
            "error": "Wrong number of arguments",
            "detail": "Argument must be: { provider: <provider>, model: <model>, messages: <messages>, settings: <settings>}",
        }
        json_out = json.dumps(response)
        print(json_out, end=None)
        sys.exit(1)

    response = runAppChat(sys.argv[1])
    json_out = json.dumps(response)
    print(json_out, end=None)
    if "error" in response:
        sys.exit(response["code"])
