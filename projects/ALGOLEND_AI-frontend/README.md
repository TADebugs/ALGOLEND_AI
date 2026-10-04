# AlgoLend AI: frontend and backend

React + TypeScript frontend and FastAPI backend for AlgoLend AI, a lending demo on the Algorand testnet. See the [root README](../../README.md) for the project overview and architecture.

Live demo (seeded, testnet): https://algolend.tanmaydesai.xyz

## What is here

- `src/`: React 18 + TypeScript app (Vite). Wallet connection uses `@txnlab/use-wallet-react` with Pera and Defly. `src/components/AIIntegration.tsx` calls the backend. `src/components/DemoMode.tsx` is the guided demo.
- `backend/`: FastAPI app (`app.py`) with the agents in `backend/ai/`:
  - **Market Oracle**: market data and pool APY suggestions. The data is simulated, not read from a live market feed.
  - **Risk Analyzer**: scores an account as a weighted sum of seven factors.
  - **Yield Optimizer**: allocation logic over mock pool data. `app.py` does not currently import it.
- `config/`: network and AI model settings (JSON).

This repo contains no accuracy or performance measurements for the agents.

## Run locally

Requires Node.js 20+ and Python 3.11.

```bash
# Backend (from this folder)
./start_backend.sh              # creates backend/venv, installs requirements, starts uvicorn on :8000

# Frontend (in a second terminal, from this folder)
cp env.example .env
npm install
npm run dev                     # needs the AlgoKit CLI; or run `npx vite` to skip client generation
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

## API endpoints

| Method | Path |
|---|---|
| GET | `/`, `/health` |
| GET | `/api/network-stats`, `/api/ai-agents/status`, `/api/market-insights` |
| POST | `/api/analyze-account`, `/api/analyze-lending-pool` |

```bash
curl -X POST http://localhost:8000/api/analyze-account \
  -H 'Content-Type: application/json' \
  -d '{"address": "ALGORAND_ADDRESS", "include_transaction_history": true}'
```

## Testnet endpoints

- Algod: https://testnet-api.algonode.cloud
- Indexer: https://testnet-idx.algonode.cloud

## Deployment

The repo has Vercel config for the frontend (`vercel.json`; `npm run build:vercel`) and Docker, Railway and Render configs for the backend (`backend/`). See [DEPLOYMENT.md](../../DEPLOYMENT.md).
