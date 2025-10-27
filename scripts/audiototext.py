import sys
import json
from dotenv import load_dotenv
import aisuite as ai

load_dotenv("./scripts/.env")

provider_list = set(["openai", "google", "deepgram", "huggingface"])

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
file = sys.argv[3]

if provider not in provider_list:
    error_out = {
        "error": "Invalid provider",
        "detail": f"Provider '{provider}' is not a valid provider",
    }
    json_out = json.dumps(error_out)
    print(json_out, end=None)
    sys.exit(2)


def runAudioToText(provider, model, file):
    """Convert audio file to text"""

    client = ai.Client()

    result = client.audio.transcriptions.create(
        model=f"{provider}:{model}",
        file=file,
    )

    return result.text


try:
    response = runAudioToText(provider, model, file)
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
