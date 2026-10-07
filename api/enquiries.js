const { getSessionFromRequest } = require('./_session');
const { supaFetch, parseBody } = require('./_supabase');

const TABLE = 'ff_inquiries';

module.exports = async (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated.' }); return; }

  try {
    if (req.method === 'GET') {
      const r = await supaFetch(`${TABLE}?select=*&order=created_at.desc`);
      res.status(r.status).json(await r.json());
      return;
    }

    if (req.method === 'PATCH') {
      const { id, status } = parseBody(req);
      if (!id || !status) { res.status(400).json({ error: 'id and status are required.' }); return; }
      const r = await supaFetch(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ status })
      });
      res.status(r.status).json(await r.json());
      return;
    }

    if (req.method === 'DELETE') {
      if (session.r !== 'admin') { res.status(403).json({ error: 'Only admins can delete enquiries.' }); return; }
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
