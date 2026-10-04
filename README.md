# AlgoLend AI

AlgoLend AI is a full-stack lending demo on the Algorand testnet. A React + TypeScript frontend talks to a FastAPI backend that runs three AI agents (Market Oracle, Risk Analyzer, Yield Optimizer), and a `LendingPool` smart contract written in Algorand TypeScript holds the deposit, borrow and repay logic. It was built for the EASyA Algorand hackathon. The agents are rule-based and the market data is simulated, so this is a demo of the architecture, not a production lending protocol.

## Links

- **Live demo:** https://algolend.tanmaydesai.xyz (seeded demo on Algorand testnet)
- **Portfolio page:** https://tanmaydesai.xyz/algolend

## Screenshots

<!-- PLACEHOLDER: screenshot -->

The repo contains no screenshot images yet.

## Stack

| Layer | Technology | Where |
|---|---|---|
| Frontend | React 18, TypeScript, Vite, `@txnlab/use-wallet-react` (Pera, Defly), `algosdk`, AlgoKit Utils | `projects/ALGOLEND_AI-frontend` |
| Backend | Python 3.11, FastAPI, Uvicorn, pandas, NumPy, scikit-learn | `projects/ALGOLEND_AI-frontend/backend` |
| Contract | Algorand TypeScript (`@algorandfoundation/algorand-typescript`), compiled with AlgoKit | `projects/ALGOLEND_AI-contracts` |
| Deploy | Docker / docker-compose, Railway, Render, Vercel configs | `backend/`, `vercel.json` |

## Architecture

```
React frontend (Vite)
   |  HTTP (JSON)                     |  wallet-signed transactions
   v                                  v
FastAPI backend (app.py)        LendingPool contract (Algorand testnet)
   |-- Market Oracle
   |-- Risk Analyzer
   '-- Yield Optimizer
```

**Frontend.** Calls the backend for agent status, network stats, market insights and account analysis (`src/components/AIIntegration.tsx`). It connects wallets and calls the contract through generated app clients (`src/contracts/`).

**Backend.** `backend/app.py` exposes:

| Method | Path |
|---|---|
| GET | `/`, `/health` |
| GET | `/api/network-stats`, `/api/ai-agents/status`, `/api/market-insights` |
| POST | `/api/analyze-account`, `/api/analyze-lending-pool` |

FastAPI also serves interactive docs at `/docs`.

**Agents** (`backend/ai/`):

- **Market Oracle** (`market_oracle.py`): produces market data and pool APY suggestions. The data is simulated (seeded values plus randomness), not read from a live market feed.
- **Risk Analyzer** (`risk_analyzer.py`): scores an account as a weighted sum of seven factors. The weights are balance 0.25, account age 0.20, transaction frequency 0.15, transaction consistency 0.15, transaction amounts 0.10, network activity 0.10 and reputation 0.05.
- **Yield Optimizer** (`yield_optimizer.py`): allocation logic over pool data. It uses mock data, and `app.py` does not currently import it.

**LendingPool contract** (`smart_contracts/lending_pool/contract.algo.ts`): `createApplication(owner, initialRate)`, `deposit`, `withdraw`, `borrow`, `repay`, `getPoolStats` and `getUserPosition`. The interest rate is stored in basis points (500 = 5%). Compiled artifacts and a generated client are checked in under `smart_contracts/artifacts/lending_pool/`.

**Not measured.** This repo has no accuracy or performance benchmarks, so the README makes no such claims.

## Run it locally

Requires Node.js 20+ (the contracts project needs 22+) and Python 3.11. These steps come from the repo's scripts, `package.json` and `requirements.txt`. I have not run them in a clean environment.

**Backend**

```bash
cd projects/ALGOLEND_AI-frontend/backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Check `http://localhost:8000/health` and `http://localhost:8000/docs`. `start_backend.sh` in the frontend folder does the same. With Docker, run `docker-compose up -d` in the `backend/` folder.

**Frontend**

```bash
cd projects/ALGOLEND_AI-frontend
cp env.example .env             # testnet algod/indexer endpoints
npm install
npm run dev                     # Vite, default http://localhost:5173
```

`npm run dev` first runs `algokit project link --all` to regenerate the app clients, so it needs the [AlgoKit CLI](https://github.com/algorandfoundation/algokit-cli). To skip that step, run `npx vite`. The API URL in `AIIntegration.tsx` is hardcoded to `http://localhost:8000`.

**Contracts**

```bash
cd projects/ALGOLEND_AI-contracts
npm install
npm run build                   # algokit compile ts ... and generate client
npm run check-types
```

`npm run deploy` needs a deployer account configured in `.env` (see `deploy-config.ts`).

**Tests.** The repo has no test scripts or test files, so there is nothing to run yet.

## Repository layout

```
projects/ALGOLEND_AI-frontend/   React app + FastAPI backend (backend/)
projects/ALGOLEND_AI-contracts/  LendingPool contract (Algorand TypeScript)
demo-ui/                         standalone demo UI source
DEPLOYMENT.md, DEMO_SCRIPT.md    deployment notes and demo walkthrough
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

There is no license file yet, so no license is granted by this repository.

## Author

Tanmay Desai · [GitHub](https://github.com/TADebugs) · [LinkedIn](https://www.linkedin.com/in/tanmaydesai2126/)
