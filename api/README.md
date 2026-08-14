# Vercel API layer

These endpoints are server-side examples for V2.2.

`students.js` reads students using the Supabase REST endpoint and a server-side service key.

Before deployment:
- set SUPABASE_URL
- set SUPABASE_SERVICE_ROLE_KEY

Never expose the service-role key to browser code.
