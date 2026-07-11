"""OpenAI provider adapter for AI Gateway."""

import os
import httpx
from typing import List, Dict, Any


OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"


class OpenAIProvider:
    """Adapter for the OpenAI Chat Completions API."""

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY", "")

    async def chat(
        self,
        model: str,
        messages: List[Dict[str, str]],
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """Send a chat request to OpenAI and return the response."""
        if not self.api_key:
            return {"error": "OPENAI_API_KEY is not set", "provider": "openai"}

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {"model": model, "messages": messages, **kwargs}

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                OPENAI_API_URL, json=payload, headers=headers
            )
            response.raise_for_status()
            return response.json()
