"""Chat router — routes requests to the appropriate LLM provider."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

from app.providers.openai_provider import OpenAIProvider
from app.providers.anthropic_provider import AnthropicProvider
from app.providers.mistral_provider import MistralProvider

router = APIRouter(prefix="/v1", tags=["chat"])

SUPPORTED_PROVIDERS = {
    "openai": OpenAIProvider,
    "anthropic": AnthropicProvider,
    "mistral": MistralProvider,
}


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    provider: str = "openai"
    model: str
    messages: List[ChatMessage]
    max_tokens: int = 1024


@router.post("/chat")
async def chat(request: ChatRequest) -> Dict[str, Any]:
    """
    Unified chat endpoint.
    Routes requests to OpenAI, Anthropic or Mistral based on `provider` field.
    """
    provider_name = request.provider.lower()

    if provider_name not in SUPPORTED_PROVIDERS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported provider: '{provider_name}'. "
                   f"Supported: {list(SUPPORTED_PROVIDERS.keys())}",
        )

    provider_cls = SUPPORTED_PROVIDERS[provider_name]
    provider = provider_cls()

    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    try:
        if provider_name == "anthropic":
            result = await provider.chat(
                model=request.model,
                messages=messages,
                max_tokens=request.max_tokens,
            )
        else:
            result = await provider.chat(
                model=request.model,
                messages=messages,
            )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return result
