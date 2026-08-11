# Headless Media SDK Ecosystem

This repository is a production-ready, scalable, and reusable monorepo containing a headless Media SDK ecosystem, built with TypeScript, React, and Turborepo.

## Architecture & Dependency Direction

The project strictly follows these dependency rules:
- **`media-core`**: The foundational SDK layer. Framework-agnostic. Contains Pexels API integration, memory caching, request de-duplication, and an event emitter. Does NOT import React or React Native.
- **`media-react`**: The React adapter for the SDK. Provides `MediaProvider` and hooks (`useSearch`, etc.). Depends ON `media-core`.
- **`media-native`**: The React Native adapter for the SDK. Follows the exact same API contract as `media-react`.
- **`media-ui-react`**: A purely Headless UI library for React. Exposes hooks like `useGrid`, `useLightbox`, and `useReelSwiper` which return prop-getters. It has NO knowledge of the SDK or APIs.
- **`media-ui-native`**: The React Native equivalent of the headless UI library.
- **`web-app`**: The application layer that connects `media-react` and `media-ui-react`.

## Folder Structure

```
.
├── apps
│   └── web-app/           # Demo Vite React Application
├── packages
│   ├── media-core/        # Pure TS SDK
│   ├── media-react/       # React Wrapper for SDK
│   ├── media-native/      # React Native Wrapper for SDK
│   ├── media-ui-react/    # Headless UI (React)
│   └── media-ui-native/   # Headless UI (React Native)
├── .agents/skills/        # AI Assistant context and skill guidelines
```

## Setup & Running

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   In `apps/web-app`, create a `.env.local` file (or provide it to your shell) with your Pexels API key:
   ```
   VITE_PEXELS_API_KEY=your_api_key_here
   ```
   *Note: In `apps/web-app/src/main.tsx`, a placeholder is used if the env var is missing.*

3. **Run the demo app**:
   ```bash
   pnpm run dev
   ```

## SDK Features
- **Caching**: `media-core` implements an in-memory cache and request de-duplication to prevent duplicate network calls.
- **Event System**: Contains an internal EventEmitter that allows applications to subscribe to `view` and `download` events. By default, it logs to the console.

## UI Library Features
- **Headless Pattern**: `media-ui-react` relies completely on the "prop getters" pattern. Consumers provide HTML and CSS while the hooks manage state, keyboard accessibility, and focus.

## Known Limitations & Future Improvements
- The React Native packages are currently stubs matching the React packages' API structure. A true RN implementation requires a mobile toolchain to test natively.
- Caching could be extended to support `sessionStorage` or `AsyncStorage` (in RN).
- The Pexels API does not have a true "trending" videos endpoint, so `popular` is used instead.

## Development & AI Integration

**AI vs Hand-Written Breakdown**
- **AI-Assisted**: The initial project scaffolding, package configurations (`turbo.json`, `package.json`, `tsconfig.json`), component boilerplate, state management logic, and the UI library prop-getter implementations were generated using AI tooling based on the provided specifications.
- **Hand-Written/Manually Verified**: The critical `media-core` abstractions, the strict enforcement of dependency boundaries, fixing type safety leaks (replacing `any` with strongly-typed generics), implementing the focus trap, error handling integration, styling compliance (stripping out inline CSS), and tracking event wiring were manually reviewed, verified, and implemented to satisfy architecture requirements.

**Skill Documentation Testing**
The skill documentation (`.agents/skills/media-ui-react/SKILL.md` and `.agents/skills/media-react/SKILL.md`) was used heavily during generation to instruct the AI on the required architectural invariants. These skill documents were validated by:
1. Conducting a comprehensive automated audit of the generated source code against the strict rules in the `SKILL.md` documents.
2. Generating a compliance report (`compliance_report.md`) checking for violations like inline CSS in headless UI packages or UI logic in core packages.
3. Manually adjusting the source code (e.g., removing `style` objects from `useReelSwiper`) when it initially diverged from the documented skill constraints, ensuring the final output accurately reflects the documented constraints.
