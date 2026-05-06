# Life in Rhythm Website + Leaderboard API

Simple Next.js website for the Unity Android game **Life in Rhythm** (TESDA NC II Caregiving Training Simulation).

## Pages

- `/` - Landing page
- `/leaderboard` - Leaderboard page with score submission
- `/about` - About page

## MongoDB Data

`/api/scores` stores and returns:

- `playerName` (string)
- `score` (number, 0-100)
- `grade` (`A | B | C | D | F`)
- `datePlayed` (ISO date string)

## Setup

1. Install dependencies:
   - `npm install`
2. Copy env template and fill your MongoDB URI:
   - `.env.local.example` -> `.env.local`
3. Start dev server:
   - `npm run dev`

## Environment Variables

- `MONGODB_URI` - your MongoDB connection string
- `MONGODB_DB_NAME` - database name (default: `life_in_rhythm`)

## API Endpoints

- `GET /api/scores` - fetch top scores (sorted by score)
- `POST /api/scores` - add a new score entry
