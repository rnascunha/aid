import sys
import json
from dotenv import load_dotenv
import aisuite as ai

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

if len(sys.argv) != 4:
    error_out = {
        "error": "Wrong number of arguments",
        "detail": "Arguments must be: <provider> <model> <message>",
    }
    json_out = json.dumps(error_out)
    print(json_out, end=None)
    sys.exit(1)

provider = sys.argv[1]
model = sys.argv[2]
message = sys.argv[3]

if provider not in provider_list:
    error_out = {
        "error": "Invalid provider",
        "detail": f"Provider '{provider}' is not a valid provider",
    }
    json_out = json.dumps(error_out)
    print(json_out, end=None)
    sys.exit(2)


def runChat(provider, model, message, temperature=0.75):
    """Running chat request to provider"""

    client = ai.Client()

    messages = [
        {"role": "user", "content": message},
    ]

    response = client.chat.completions.create(
        model=f"{provider}:{model}",
        messages=messages,
        temperature=temperature,
    )
    return response.choices[0].message.content


try:
    # print(f"runChat({provider}, {model}, {message})")
    response = runChat(provider, model, message)
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
