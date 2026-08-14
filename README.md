# CLASSHUB V2.2 — Supabase + Vercel

## Target
CLASSHUB X APAT 1: frontend existing + Supabase database + admin-ready API layer.

## Folder structure
- `index.html`, `style.css`, `app.js`: existing frontend starter.
- `supabase/schema.sql`: creates tables and seed data.
- `supabase/README.md`: setup instructions.
- `api/`: Vercel serverless API examples.
- `.env.example`: environment variables.

## Important
Do NOT put the Supabase service-role key in frontend JavaScript or GitHub.
Only use the public anon key in browser code.
For Vercel, put secrets in Project Settings > Environment Variables.

## Fast setup
1. Create a Supabase project on the free tier.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy the Project URL and anon public key.
4. Create Vercel environment variables:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (server/API only)
5. Deploy the project to Vercel.
6. Replace the demo frontend data with the API/database calls in V2.3.

This V2.2 package deliberately keeps the current UI stable while preparing the real data layer.
