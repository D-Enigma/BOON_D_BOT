# BOON D' BOT (BDB) — Phase 1 Demo

BOON D' BOT is a crisis-response assistant prototype designed to help users find appropriate next steps during emergencies.

## Current build: Day 1

- Flask web application scaffold
- Emergency overview dashboard
- Demo-only SOS confirmation flow
- Browser geolocation permission flow
- Rule-based emergency chat prototype
- Clearly labelled sample resource directory
- API health endpoint

## Important safety notice

**This is a demonstration only. It does not contact emergency services or trusted contacts.** Resource entries are fictional placeholders. Chat responses are not a diagnosis or a substitute for emergency professionals. Do not rely on this prototype in a real emergency.

## Requirements

- Python 3.10+
- pip
- A modern browser

## Run locally

### Windows PowerShell

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

If PowerShell blocks activation, run the environment's Python directly:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

Open `http://127.0.0.1:5000` in your browser. Browser geolocation usually requires a secure context; `localhost` is treated as a secure context by modern browsers.

## API endpoints

- `GET /api/health` — basic app status
- `GET /api/services` — fictional sample directory
- `POST /api/chat` — rule-based demo assistant
- `POST /api/sos-demo` — records a simulated SOS event in the server log; it sends no notifications

## Day-by-day development rule

Each work session should produce a small, tested increment, a short changelog entry, and a meaningful Git commit. Do not commit API keys, personal data, or real emergency contact information.

## Roadmap

- V1: Core web demo and safe simulated workflows
- V2: Verified online data and supported integrations
- V3: Essential offline capability
- V4: Advanced device features and real-world deployment preparation
