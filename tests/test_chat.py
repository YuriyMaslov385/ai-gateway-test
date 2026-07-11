"""Tests for the /v1/chat endpoint."""

from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

VALID_PAYLOAD = {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}],
}


def test_chat_unsupported_provider_returns_400():
    """Unknown provider should return HTTP 400."""
    payload = {**VALID_PAYLOAD, "provider": "unknown_provider"}
    response = client.post("/v1/chat", json=payload)
    assert response.status_code == 400
    assert "Unsupported provider" in response.json()["detail"]


def test_chat_missing_model_returns_422():
    """Missing required field `model` should return HTTP 422."""
    payload = {"provider": "openai", "messages": [{"role": "user", "content": "Hi"}]}
    response = client.post("/v1/chat", json=payload)
    assert response.status_code == 422


@patch(
    "app.routers.chat.OpenAIProvider.chat",
    new_callable=AsyncMock,
    return_value={"choices": [{"message": {"content": "Hi there!"}}]},
)
def test_chat_openai_success(mock_chat):
    """Valid OpenAI request should return provider response."""
    response = client.post("/v1/chat", json=VALID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert "choices" in data


@patch(
    "app.routers.chat.AnthropicProvider.chat",
    new_callable=AsyncMock,
    return_value={"content": [{"text": "Hello!"}]},
)
def test_chat_anthropic_success(mock_chat):
    """Valid Anthropic request should return provider response."""
    payload = {**VALID_PAYLOAD, "provider": "anthropic", "model": "claude-3-5-sonnet-20241022"}
    response = client.post("/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "content" in data
