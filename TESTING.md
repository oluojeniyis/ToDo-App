# Browser testing checklist

Start Orbit using `npm run dev` from the repository root. Start TeesTale in a second terminal from `teestale/` with its own `npm install` and `npm run dev`. They are separate Next.js apps and use port 3000 by default; assign a different port to run them simultaneously. Test the shop at a mobile viewport around 375 px wide as well as a desktop-size viewport.

## TeesTale shop

- Filter by Wholesale Blanks, Retail Polos, Bespoke / Custom Mesh, and Accessories; search by product name and confirm no-result and clear-filter states.
- Change size and basic color on a product. On the custom jersey, switch between No mesh, Side ventilation, and Full back mesh; confirm the preview and selected values update.
- On wholesale items, switch between piece, pack of 50, and bale of 100 and confirm the displayed NGN price updates. Add products to the bag and confirm the selected size, color, mesh, and sales unit are retained.
- Confirm wholesale minimum quantities are applied, quantity controls respect the minimum, subtotal updates, and remove returns the correct empty state.
- Refresh with items in the bag and confirm they persist from `teestale.cart.v1`; clear site data and confirm the bag returns empty.
- Open and close the bag with its close button, Escape, and the backdrop; use keyboard navigation and confirm focus is visible. Check the grid and drawer at both desktop and mobile widths.
- From the TeesTale app, request `/api/products` and confirm it returns the mock catalog as JSON. Supabase database credentials and live database access are not configured in this phase.

## Orbit dashboard

- On a clean browser profile, confirm three sample tasks appear with varied priorities, due dates, and one completed task.
- Add a high-, medium-, or low-priority task, with and without a due date. Blank task names should not be accepted.
- Edit a task's name, priority, and due date; confirm the updated values remain after refresh.
- Toggle completion and confirm the progress percentage, counters, and completed styling update.
- Delete a task and confirm it stays deleted after refresh.
- Try All, Active, and Completed filters from both the task filter row and sidebar navigation.
- Switch among Light, Dark, Neon, and Glass, then refresh to confirm the selected theme persists.
- Use a dated task's calendar icon to open a prefilled Google Calendar event. Export `.ics` and confirm a calendar file downloads.
- Open **Sign in**, switch to **Create account**, and submit; the app must clearly say authentication is not configured and that no credentials were sent.
- Select Google Calendar, Calendly, and Microsoft Calendar; each should state that setup is required and no connection was made.
- Enter `<script>alert(1)</script>` as a task and confirm it is rendered as text.
- Use keyboard navigation to operate controls and dialogs; confirm Escape, the close button, and clicking outside a dialog close it.
- Clear the browser's site data in Orbit and refresh to confirm the three first-run sample tasks return.
- Add a sticky note by double-clicking the canvas and by using **New note**; edit it inline, drag it around, and refresh to confirm notes persist independently of tasks.
- Drag a sticky note onto today's timeline, pick a time, and confirm it becomes a timed task and appears on the timeline; confirm timed tasks export with a 10-minute `.ics` reminder.
- Choose **Orbital sweep** and verify unfinished notes move to Drawer Archive; restore/delete an archived note. A converted note should no longer remain on the canvas.
- Add a calendar snapshot to `orbit.calendar.events.v1` in local storage and confirm today's dated event appears in the timeline. A real provider sync/webhook is not configured.
- Check the quiet reminder banner for an upcoming item due within an hour; it should not create browser notifications or repeat alarms.

## Automated checks

```powershell
npm run lint
npm run typecheck
npm run build
npm run test:calendar
```

Run shop checks from `teestale/`: `npm run lint`, `npm run typecheck`, and `npm run build`.

Authentication and connected calendar sync are intentionally not testable until a backend and provider OAuth configuration are implemented.
