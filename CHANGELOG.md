# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Streaming response support
- Rate limiting middleware
- Request/response logging middleware
- Cost tracking per request
- Authentication layer
- Fallback logic between providers

---

## [0.2.0] - 2026-07-12

### Added
- `app/providers/` package with provider adapters:
  - `OpenAIProvider` — routes to OpenAI Chat Completions API
  - `AnthropicProvider` — routes to Anthropic Messages API
  - `MistralProvider` — routes to Mistral AI Chat Completions API
- `app/routers/chat.py` — unified `/v1/chat` endpoint with real provider routing
- Pydantic request validation (`ChatRequest`, `ChatMessage` models)
- HTTP 400 for unsupported providers, 422 for invalid payloads, 502 for upstream errors
- `tests/` package with 7 tests covering health and chat endpoints
- `CONTRIBUTING.md` with setup guide and contribution instructions
- `CHANGELOG.md` (this file)

### Changed
- `app/main.py` refactored to use `app.include_router(chat_router)` instead of inline endpoint
- Version bumped to `0.2.0`

---

## [0.1.0] - 2026-07-12

### Added
- Initial project skeleton
- `app/main.py` with FastAPI application, CORS middleware
- `/health` endpoint returning `{status: ok, version}`
- `/v1/chat` stub endpoint (echo only, no real routing)
- `Dockerfile` and `docker-compose.yml` for one-command setup
- `.env.example` with placeholders for OpenAI, Anthropic, Mistral API keys
- `requirements.txt` with core dependencies
- `README.md` with Problem, Quick Start, Features, Roadmap, Use Cases
- MIT License
- GitHub Topics and About description
- Release `v0.1.0` tagged on main
