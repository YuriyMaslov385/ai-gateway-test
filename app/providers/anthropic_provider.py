"""Anthropic provider adapter for AI Gateway."""

import os
import httpx
from typing import List, Dict, Any


ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"


class AnthropicProvider:
    """Adapter for the Anthropic Messages API."""

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY", "")

    async def chat(
        self,
        model: str,
        messages: List[Dict[str, str]],
        max_tokens: int = 1024,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """Send a chat request to Anthropic and return the response."""
        if not self.api_key:
            return {"error": "ANTHROPIC_API_KEY is not set", "provider": "anthropic"}

        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": ANTHROPIC_VERSION,
            "Content-Type": "application/json",
        }
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            **kwargs,
        }

        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                ANTHROPIC_API_URL, json=payload, headers=headers
            )
            response.raise_for_status()
            return response.json()
