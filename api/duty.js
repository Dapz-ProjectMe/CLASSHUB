export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const url = `${process.env.SUPABASE_URL}/rest/v1/duty_rosters?select=day,student_id,students(name,student_number)&order=day.asc`;
  const r = await fetch(url, {
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });
  const data = await r.json();
  return res.status(r.ok ? 200 : 500).json(data);
}
