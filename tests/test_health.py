"""Tests for the /health endpoint."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_200():
    """Health endpoint should return HTTP 200."""
    response = client.get("/health")
    assert response.status_code == 200


def test_health_returns_ok_status():
    """Health endpoint should return status: ok."""
    response = client.get("/health")
    data = response.json()
    assert data["status"] == "ok"


def test_health_returns_version():
    """Health endpoint should include a version field."""
    response = client.get("/health")
    data = response.json()
    assert "version" in data
    assert data["version"] == "0.2.0"
