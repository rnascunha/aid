from enum import Enum
import os


class ProviderAuthType(Enum):
    AUTH_API_KEY = "key"
    AUTH_GOOGLE = "google"
    AUTH_IBM_WATSONX = "watsonx"


providerList = [
    {
        "id": "openai",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "OPENAI_API_KEY"},
        "type": ["chat", "audioToText"],
    },
    {
        "id": "anthropic",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "ANTHROPIC_API_KEY"},
        "type": ["chat"],
    },
    {
        "id": "mistral",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "MISTRAL_API_KEY"},
        "type": ["chat"],
    },
    {
        "id": "groq",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "GROQ_API_KEY"},
        "type": ["chat"],
    },
    {
        "id": "cohere",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "CO_API_KEY"},
        "type": ["chat"],
    },
    {
        "id": "cerebras",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "CEREBRAS_API_KEY"},
        "type": ["chat"],
    },
    {
        "id": "ollama",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "OLLAMA_API_KEY"},
        "type": ["chat"],
    },
    {
        "id": "sambanova",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "SAMBANOVA_API_KEY"},
        "type": ["chat"],
    },
    {
        "id": "deepseek",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "DEEPSEEK_API_KEY"},
        "type": ["chat"],
    },
    {
        "id": "nebius",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "NEBIUS_API_KEY"},
        "type": ["chat"],
    },
    {
        "id": "xai",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "XAI_API_KEY"},
        "type": ["chat"],
    },
    {
        "id": "inception-labs",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "INCEPTION_API_KEY"},
        "type": ["chat"],
    },
    {
        "id": "deepgram",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "DEEPGRAM_API_KEY"},
        "type": ["audioToText"],
    },
    {
        "id": "huggingface",
        "auth_type": ProviderAuthType.AUTH_API_KEY,
        "auth": {"key": "HF_TOKEN"},
        "type": ["audioToText"],
    },
    {
        "id": "watsonx",
        "auth_type": ProviderAuthType.AUTH_IBM_WATSONX,
        "auth": {
            "key": "WATSONX_API_KEY",
            "service_url": "WATSONX_SERVICE_URL",
            "project_id": "WATSONX_PROJECT_ID",
        },
        "type": ["chat"],
    },
    {
        "id": "google",
        "auth_type": ProviderAuthType.AUTH_GOOGLE,
        "auth": {
            "project_id": "GOOGLE_PROJECT_ID",
            "region": "GOOGLE_REGION",
            "application_credendials": "GOOGLE_APPLICATION_CREDENTIALS",
        },
        "type": ["chat", "audioToText"],
    },
]

providerMap = {p["id"]: p for p in providerList}
providerChatIds: list[str] = [p["id"] for p in providerList if "chat" in p["type"]]
providerAudioToTextIds: list[str] = [
    p["id"] for p in providerList if "audioToText" in p["type"]
]


def setProviderAuth(providerId: str, auth: dict[str, str]):
    if not providerId in providerMap:
        raise Exception("Provider '{providerId}' not found")

    provider = providerMap[providerId]
    for key, value in provider["auth"].items():
        if not key in auth or auth[key] == "":
            raise Exception(f"Missing '{key}' auth field")
        os.environ[value] = auth[key]
