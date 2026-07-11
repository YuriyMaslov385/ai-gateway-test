from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Gateway",
    description="Open-source FastAPI-based AI gateway for unified LLM provider access.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}


@app.post("/v1/chat")
async def chat(request: dict):
    """
    Unified chat endpoint. Routes request to the specified provider.
    Expected body: { provider, model, messages }
    """
    provider = request.get("provider", "openai")
    # Provider routing logic goes here
    return {
        "provider": provider,
        "status": "routing_not_yet_implemented",
        "echo": request,
    }
