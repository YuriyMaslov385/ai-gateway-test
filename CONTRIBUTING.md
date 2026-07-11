# Contributing to ai-gateway-test

Thank you for your interest in contributing! This project is in early development and welcomes all contributions.

## How to contribute

### Reporting bugs

Open an issue and include:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your OS and Python version

### Suggesting features

Open an issue with the label `enhancement` and describe:
- The use case you want to solve
- Your proposed approach

### Submitting code

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `pytest tests/`
6. Commit with a clear message: `git commit -m "feat: describe your change"`
7. Push and open a pull request

## Development setup

```bash
git clone https://github.com/YuriyMaslov385/ai-gateway-test.git
cd ai-gateway-test
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pip install pytest httpx
```

## Running tests

```bash
pytest tests/ -v
```

## Adding a new provider

1. Create `app/providers/your_provider.py` with a class that has an async `chat()` method
2. Register it in `app/providers/__init__.py`
3. Add it to `SUPPORTED_PROVIDERS` in `app/routers/chat.py`
4. Add tests in `tests/test_chat.py`
5. Document it in `README.md`

## Commit message format

Use conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `refactor:` code restructure
- `test:` test changes
- `docs:` documentation
- `chore:` maintenance

## Code style

- Python 3.11+
- Follow PEP 8
- Add docstrings to all public functions and classes
- Type hints are encouraged

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
