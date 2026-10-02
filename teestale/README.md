# TeesTale

TeesTale is an independent Next.js app in this repository, separate from the Orbit app at the repository root. To run it locally:

```powershell
npm install
npm run dev
```

Run those commands from this `teestale/` directory. Use `npm run lint`, `npm run typecheck`, and `npm run build` here to validate the app. To deploy TeesTale independently on Vercel, configure its project root directory as `teestale`.

The storefront and product API currently use mock catalog data. Supabase integration is scaffolded but not connected; copy `.env.example` to `.env.local` and provide the public project URL and anon key only when connecting a Supabase project. Never expose a service-role key in browser code.
