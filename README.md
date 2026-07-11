# ai-gateway-test

> Open-source FastAPI-based AI gateway for experimenting with unified access to LLM providers.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)

---

## Problem

Working with multiple AI APIs usually means juggling different request formats, authentication patterns, and response handling for every provider (OpenAI, Anthropic, Mistral, etc.). This project explores a simpler approach: **one gateway layer** that sits in front of all provider APIs and normalises requests and responses through a single interface.

---

## Overview

This is a minimal, Docker-ready AI gateway built with FastAPI. It serves as a lightweight foundation for:

- Routing requests to different LLM providers
- Unified request/response format
- A clean base for adding logging, retries, fallback logic, and rate limiting

---

## Quick Start

```bash
git clone https://github.com/YuriyMaslov385/ai-gateway-test.git
cd ai-gateway-test
cp .env.example .env
# Fill in your API keys in .env
docker compose up --build
```

The gateway starts at `http://localhost:8000`. Check the auto-generated docs at `http://localhost:8000/docs`.

---

## Example Request

```bash
curl -X POST http://localhost:8000/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## Features

- **FastAPI** — async HTTP gateway with automatic OpenAPI docs
- **Docker-ready** — single `docker compose up` to run
- **Minimal structure** — easy to extend with new providers
- **OpenAI-compatible interface** — drop-in routing for OpenAI-format requests
- **Good starting point** for production AI infrastructure experiments

---

## Project Structure

```
ai-gateway-test/
├── app/
│   ├── main.py          # FastAPI app entrypoint
│   ├── routers/         # Route handlers per provider
│   └── providers/       # Provider adapter modules
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── .env.example
└── README.md
```

---

## Use Cases

- Testing LLM integrations without writing boilerplate for each provider
- Building internal AI tooling with a single stable API surface
- Prototyping provider-agnostic AI infrastructure
- Learning how production AI gateways are structured
- A base for adding observability (logging, tracing, cost tracking)

---

## Roadmap

- [ ] Provider adapters (OpenAI, Anthropic, Mistral)
- [ ] Request/response logging middleware
- [ ] Retry and fallback logic between providers
- [ ] Rate limiting per API key
- [ ] Authentication layer
- [ ] Streaming response support
- [ ] Cost tracking per request
- [ ] Better developer documentation

---

## Contributing

Pull requests and issues are welcome. This is an early-stage project — the goal is a clean, understandable codebase that others can learn from and build on.

---

## License

[MIT](LICENSE)
