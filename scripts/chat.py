import sys
import json
from itertools import chain
from dotenv import load_dotenv
import aisuite as ai

import ai_tools as tools

load_dotenv("./scripts/.env")

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

if len(sys.argv) < 4:
    error_out = {
        "error": "Wrong number of arguments",
        "detail": "Arguments must be: <provider> <model> <message> [...<context>]",
    }
    json_out = json.dumps(error_out)
    print(json_out, end=None)
    sys.exit(1)

provider = sys.argv[1]
model = sys.argv[2]
message = sys.argv[3]
context = sys.argv[4:] if len(sys.argv) > 4 else []

if context:
    try:
        context = [json.loads(c) for c in context]
    except Exception as e:
        error_out = {
            "error": "Error parsing context",
            "detail": "Error parsing context value",
        }
        json_out = json.dumps(error_out)
        print(json_out, end=None)
        sys.exit(2)

messages = list(
    chain(
        [{"role": "system", "content": "You are a helpful assistant."}],
        context,
        [{"role": "user", "content": message}],
    )
)

if provider not in provider_list:
    error_out = {
        "error": "Invalid provider",
        "detail": f"Provider '{provider}' is not a valid provider",
    }
    json_out = json.dumps(error_out)
    print(json_out, end=None)
    sys.exit(2)


def runChat(provider, model, messages, temperature=0.75):
    """Running chat request to provider"""

    client = ai.Client()

    response = client.chat.completions.create(
        model=f"{provider}:{model}",
        messages=messages,
        tools=[tools.get_current_datetime],
        temperature=temperature,
        max_turns=2,
    )
    return response.choices[0].message.content


try:
    response = runChat(provider, model, messages)
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
