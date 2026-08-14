# Supabase setup

Run `schema.sql` in Supabase SQL Editor.

Tables:
- students
- schedules
- announcements
- duty_rosters

The SQL also enables Row Level Security.

For the first working prototype:
- Public users can read active class information.
- Admin writes should be routed through authenticated server/API logic.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in `app.js`.

Admin authentication can be added with Supabase Auth in V2.3.


## V2.2 FIX
The schedule seed explicitly casts `start_time` and `end_time` to PostgreSQL `time`,
so it works correctly in Supabase SQL Editor.
