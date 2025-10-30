import sys
import json

from dotenv import load_dotenv
import aisuite as ai
import ai_tools as tools

from pydantic import BaseModel
from pydantic.types import PositiveInt
from typing import List, Literal


load_dotenv("./scripts/.env")


class MessagesContext(BaseModel):
    role: Literal["system", "assistant", "user"]
    content: str


class MessageListValidate(BaseModel):
    messages: List[MessagesContext]


class SettingsValidate(BaseModel):
    temperature: float
    tools: List[Literal["get_current_datetime"]]
    maxTurns: PositiveInt


provider_list = set(
    [
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
)

if len(sys.argv) != 5:
    error_out = {
        "error": "Wrong number of arguments",
        "detail": "Arguments must be: <provider> <model> <messages> <settings>",
    }
    json_out = json.dumps(error_out)
    print(json_out, end=None)
    sys.exit(1)

provider = sys.argv[1]
model = sys.argv[2]
messages = sys.argv[3]
settings = sys.argv[4]

try:
    messagesParsed = json.loads(messages)
    MessageListValidate(**{"messages": messagesParsed})
except Exception as e:
    error_out = {
        "error": "Error parsing messages",
        "detail": str(e),
    }
    json_out = json.dumps(error_out)
    print(json_out, end=None)
    sys.exit(2)

try:
    settingsParsed = json.loads(settings)
    SettingsValidate(**settingsParsed)
except Exception as e:
    error_out = {
        "error": "Error parsing settings",
        "detail": str(e),
    }
    json_out = json.dumps(error_out)
    print(json_out, end=None)
    sys.exit(3)

if provider not in provider_list:
    error_out = {
        "error": "Invalid provider",
        "detail": f"Provider '{provider}' is not a valid provider",
    }
    json_out = json.dumps(error_out)
    print(json_out, end=None)
    sys.exit(4)


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


try:
    response = runChat(provider, model, messagesParsed, settingsParsed)
    out = {"success": True, "response": response}
    json_out = json.dumps(out)
    print(json_out, end=None)
except Exception as e:
    error_out = {
        "error": "Error running chat request",
        "detail": str(e),
    }
    json_out = json.dumps(error_out)
    print(json_out, end=None)
    sys.exit(3)
