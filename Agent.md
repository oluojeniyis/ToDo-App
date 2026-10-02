# Agent guide

## Project overview

TeesTale is an independent Next.js app in `teestale/`, with its own `package.json`, configuration, App Router under `teestale/src/app/`, product catalog, Supabase scaffold, and migration. Run it from that directory; set Vercel's project root to `teestale` to deploy it separately from Orbit.

Orbit remains the root Next.js app and main home route at `src/app/page.tsx` (`/`), with its canvas at `src/app/orbit-canvas.tsx` and global styles in `src/app/globals.css`. Supabase schema and client setup are scaffolding only; the TeesTale catalog and `/api/products` currently use mock data.

## Development

- Use Node.js 20.9 or later and npm.
- For Orbit, install and run npm commands from the repository root. For TeesTale, install and run npm commands from `teestale/`.
- The mock storefront and Orbit dashboard do not require environment variables. `teestale/src/lib/supabaseClient.ts` requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` when the client getter is used; never add service-role secrets to client code.

## Project conventions

- Preserve the existing Next.js App Router structure, TypeScript types, and CSS conventions.
- Keep TeesTale in its standalone `teestale/` app and Orbit in the repository root; do not remove Orbit task, calendar-adapter, or canvas behavior when changing the shop.
- Keep shop customizations and sales-unit selection in cart lines, and preserve the client-side cart in its own `teestale.cart.v1` localStorage record.
- Keep task data and appearance local to the browser; task state is persisted in `localStorage`.
- Keep sticky canvas notes in their own `orbit.canvas.v1` localStorage record, separate from task storage. Preserve the local-midnight sweep and archive/restore behavior.
- Treat calendar snapshots and `orbit:calendar-change` as adapter hooks only; never imply a live provider connection without OAuth and a configured webhook integration.
- Seed the three sample tasks only when task storage has never been initialized. An intentionally empty saved task list must remain empty.
- Keep account and calendar integration controls clearly identified as previews unless real, secure integrations are implemented.
- Maintain accessible labels, keyboard operation, visible focus states, and responsive layouts when changing UI.
- Avoid introducing dependencies for functionality already supported by the existing stack.

## Validation

Before handing off code changes, run:

```powershell
npm run lint
npm run typecheck
npm run build
npm run test:calendar
cd teestale
npm run lint
npm run typecheck
npm run build
```

For user-facing behavior, also consult the manual browser checklist in `TESTING.md`.
