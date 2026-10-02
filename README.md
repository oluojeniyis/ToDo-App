# Orbit Dashboard and TeesTale Shop

Orbit remains the main application at `/`. TeesTale is a separate storefront at `/teestale`, with its own configurable apparel catalog and browser-persisted shopping bag.

Orbit is a responsive Next.js App Router dashboard for managing daily tasks. It includes task progress, priorities, due dates, local persistence, four appearance themes, and a locally generated focus suggestion. Google Calendar, Calendly, Microsoft Calendar, and account controls are clearly marked as previews; no authentication or connected sync is implemented.

The Orbit Canvas adds a lightweight, separately persisted sticky-note sandbox beside today's timeline. Double-click the canvas or choose **New note** to jot a thought; drag notes to arrange them or drop/schedule one on the timeline to convert it into a timed Orbit task. The gentle reminder banner only highlights an upcoming item within the next hour. **Orbital sweep** and an automatic local-midnight sweep move unfinished notes into the restorable Drawer Archive.

The timeline displays Orbit tasks due today, plus validated read-only calendar event snapshots saved under `orbit.calendar.events.v1` in local storage. An integration adapter in the same browser tab can dispatch `new CustomEvent("orbit:calendar-change", { detail: { type: "updated" | "deleted", event } })`; changes carrying `event.extendedProperties.private.orbitTaskId` update the matching Orbit task without changing its completion state. This is an adapter seam, not a live calendar connection: account/OAuth setup, secure webhook handling, and provider sync are not configured. Calendar event snapshots may use `{ id, summary, start: { dateTime } }` or `{ id, summary, start: { date } }`; include `source` to label the provider.

## Run in VS Code or a browser

Requirements: Node.js 20.9 or later and npm.

1. Open this project folder in VS Code.
2. In the integrated terminal, run `npm install` once, then `npm run dev`.
3. To use VS Code's integrated browser, open the Command Palette (`Ctrl+Shift+P`), run **Simple Browser: Show**, and enter `http://localhost:3000` for Orbit or `http://localhost:3000/teestale` for the TeesTale storefront.
4. To stop the development server, focus the terminal and press `Ctrl+C`.

The mock storefront and Orbit dashboard require no environment variables. TeesTale cart data and Orbit task, canvas, and appearance data are stored in the current browser's `localStorage`. The Supabase client scaffold requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` only when it is called; no credentials are included in this repository.

## Validate

```powershell
npm run lint
npm run typecheck
npm run build
```

See [TESTING.md](TESTING.md) for a browser checklist.

## Calendar and account integrations

Tasks can open a prefilled, single-task Google Calendar event or export all dated tasks to an `.ics` file. These are client-side convenience features, not a connection or ongoing synchronization. Sign-in/sign-up and Google Calendar, Calendly, and Microsoft Calendar buttons are setup previews and do not transmit credentials or create accounts.

Live sign-in and calendar sync would require a secure backend, provider OAuth registrations/credentials, redirect URI configuration, token storage and refresh, and provider-specific API integrations. No secrets or credentials are included in this project.

The dependency-free JavaScript integration module at `src/lib/calendar-service.mjs` parses supported date phrases (including “tomorrow at 3 PM”), builds reminder event objects, and falls back to an `.ics` payload when provider authorization is missing or rejected. Provider adapters may implement `createEvent(event, { accessToken })` and `subscribeToChanges(handler)`. Change callbacks should use `{ type: "updated" | "deleted", event }`, with the Orbit task id in `event.extendedProperties.private.orbitTaskId`; the supplied handler returns an updated task with `calendarSyncStatus` while preserving its completion state. Real Google change notifications need provider OAuth, a publicly reachable backend webhook, and channel renewal; `.ics` files are export-only and cannot report subsequent calendar edits.

```js
import { createCalendarIntegrationService } from "./src/lib/calendar-service.mjs";

const calendar = createCalendarIntegrationService({ provider });
const result = await calendar.createReminder(task, "Tomorrow at 3 PM", { accessToken });
// result.mode is "provider" on success, otherwise download result.ics as a .ics file.
```

Relative phrases use the browser/runtime local timezone and default to 9:00 AM if no time is specified. Supported forms include today, tomorrow, “in N days”, weekdays, and `YYYY-MM-DD`, optionally followed by a time. Unrecognized or invalid dates are rejected instead of guessed.

Run the calendar service tests with `npm run test:calendar`.

## Advanced roadmap

1. **Secure OAuth and calendar sync:** add a backend with encrypted token storage, provider consent, two-way event synchronization, and conflict resolution.
2. **AI planning workspace:** connect a vetted AI service through a server-side endpoint for task breakdowns, scheduling suggestions, and user-approved changes.
3. **Shared projects and collaboration:** add authenticated workspaces, assignments, comments, recurring tasks, and real-time updates backed by a database.

You can add your own GitHub repositories as projects in the Copilot app sidebar to continue development with the repository's code and history.

## Current Project Status

- **Phase 2 — shop UI:** Complete at `/teestale`. The storefront provides category filters and search across wholesale blanks, retail polos, bespoke mesh, and accessories; product options include size, basic color, mesh placement, and supported piece/pack/bale pricing. The shopping bag persists locally, including customizations and quantity. Checkout is intentionally out of scope.
- **Phase 3 — scaffolding:** Database migration, lazy Supabase client singleton, and `GET /api/products` are in place. The API currently serves the TypeScript mock catalog; the migration has not been applied to an external Supabase project, and no credentials or live database connection are configured.
- **Next steps:** Configure the two public Supabase environment variables and apply the migration in the intended Supabase project, then replace the mock catalog API source with database-backed reads. Authentication, order submission, and payment/checkout flows are not implemented.
