# Gamified Fitness Mentor

A demo application that gamifies life progress across 4 chapters: Health, Finance, Purpose, and Relationships. Features a "Talking Mentor" powered by D-ID.

## Features
- **D-ID Integration**: Personalized video mentorship.
- **Seeded Simulation**: Generates consistent dummy data based on user profile.
- **Gamification**: Tracks "Momentum" and "Trust" as you complete skill cards.
- **Reactive UI**: Clean, dark-mode interface.

## Quick Start

### 1. Backend
The backend handles API calls to D-ID to keep your API key secure.

```bash
cd backend
npm install
# Rename or edit .env to add your key
# DID_API_KEY=your_key_here
npm run dev
```

### 2. Frontend
The frontend is the main user interface.

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Testing Logic
Run unit tests for the gamification engine:
```bash
cd frontend
npm test
```
