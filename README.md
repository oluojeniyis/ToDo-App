# Orbit — AI-assisted To-Do Dashboard

Orbit is a responsive Next.js App Router dashboard for managing daily tasks. It includes task progress, priorities, due dates, local persistence, four appearance themes, and a locally generated focus suggestion. Google Calendar, Calendly, Microsoft Calendar, and account controls are clearly marked as previews; no authentication or connected sync is implemented.

## Run in VS Code or a browser

Requirements: Node.js 20.9 or later and npm.

1. Open this project folder in VS Code.
2. In the integrated terminal, run `npm install` once, then `npm run dev`.
3. To use VS Code's integrated browser, open the Command Palette (`Ctrl+Shift+P`), run **Simple Browser: Show**, and enter `http://localhost:3000`. You can also open that URL in your regular browser. The dashboard is the Next.js home route (`src/app/page.tsx`).
4. To stop the development server, focus the terminal and press `Ctrl+C`.

The app requires no environment variables. Task data and appearance are stored in the current browser's `localStorage`; clearing site data resets it to the three first-run sample tasks.

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

## Advanced roadmap

1. **Secure OAuth and calendar sync:** add a backend with encrypted token storage, provider consent, two-way event synchronization, and conflict resolution.
2. **AI planning workspace:** connect a vetted AI service through a server-side endpoint for task breakdowns, scheduling suggestions, and user-approved changes.
3. **Shared projects and collaboration:** add authenticated workspaces, assignments, comments, recurring tasks, and real-time updates backed by a database.

You can add your own GitHub repositories as projects in the Copilot app sidebar to continue development with the repository's code and history.
