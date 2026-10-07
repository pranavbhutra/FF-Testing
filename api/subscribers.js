const { getSessionFromRequest } = require('./_session');
const { supaFetch } = require('./_supabase');

const TABLE = 'ff_newsletter';

module.exports = async (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated.' }); return; }

  try {
    if (req.method === 'GET') {
      const r = await supaFetch(`${TABLE}?select=*&order=created_at.desc`);
      res.status(r.status).json(await r.json());
      return;
    }

    if (req.method === 'DELETE') {
      const id = (req.query && req.query.id) || new URL(req.url, 'http://x').searchParams.get('id');
      if (!id) { res.status(400).json({ error: 'id is required.' }); return; }
      const r = await supaFetch(`${TABLE}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
      res.status(r.status).json({ ok: r.ok });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach Supabase.', detail: String(err) });
  }
};
