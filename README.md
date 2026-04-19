# Traffic_CTRL 

**UI on github pages:** [https://husaria55.github.io/traffic_lights/](https://husaria55.github.io/traffic_lights/)

Project was created as a recruitment task for AVSystem.
It is a smart traffic light simulator for a 4-way intersection, written in TypeScript. It has two separate interfaces sharing one logic engine:

1. CLI script
2. Web app

## How to run?

Make sure you have Node.js installed, then
```bash
npm install

# CLI
npm run simulate input.json output.json

# Web app
npm run dev
```

## How the algorithm works?
The core lives in TrafficController and uses a State Machine + semi-adaptive logic.
4 safe phases (no collisions possible):

NS_GREEN - North-South green, East-West red
NS_YELLOW - buffer phase
EW_GREEN - East-West green, North-South red
EW_YELLOW - buffer phase

Conflicting directions can never both be green - it's enforced at the type level.
Adaptive timing:

MIN_GREEN_DURATION = 3 - minimum ticks before any switch (prevents flickering)
After minimum: each tick checks if cross-traffic is greater than current direction load

Smaller cross-traffic -> current direction stays green
Greater cross-traffic  -> transition to yellow, then switch


MAX_GREEN_DURATION = 10 - hard cap to prevent starvation on side roads

## UI
Designed in a industrial style - monospaced fonts, physical lamp representations, raw borders. Meant to look like an actual traffic controller dashboard.
Supports: manual vehicle adding, single-step (EXECUTE_TICK), and auto AUTOPLAY mode.

## CI/CD
GitHub Actions pipeline runs on every push:

- Requirement test - generates a test input.json and runs npm run simulate to make sure the main task requirement never regresses

- Lint + type check - ESLint + tsc -b

- Auto-deploy - Vite build → GitHub Pages


## Stack
- Language: TypeScript
- Validation: Zod
- Frontend: React + Vite + Tailwind CSS v4
- CLI runtime: Node.js + tsx
- DevOps: GitHub Actions, GitHub Pages