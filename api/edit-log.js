const { getSessionFromRequest } = require('./_session');
const { supaFetch, parseBody } = require('./_supabase');

const TABLE = 'ff_edit_log';

module.exports = async (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated.' }); return; }

  try {
    if (req.method === 'GET') {
      const r = await supaFetch(`${TABLE}?select=*&order=created_at.desc&limit=200`);
      res.status(r.status).json(await r.json());
      return;
    }

    if (req.method === 'POST') {
      const { action, fabricName } = parseBody(req);
      if (!action) { res.status(400).json({ error: 'action is required.' }); return; }
      const r = await supaFetch(TABLE, {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          id: 'l' + Date.now(),
          action: `${session.u}: ${action}`,
          fabricName: fabricName || null,
          date: new Date().toISOString()
        })
      });
      res.status(r.status).json({ ok: r.ok });
      return;
    }

    if (req.method === 'DELETE') {
      if (session.r !== 'admin') { res.status(403).json({ error: 'Only admins can clear the log.' }); return; }
      const r = await supaFetch(`${TABLE}?id=not.is.null`, { method: 'DELETE' });
      res.status(r.status).json({ ok: r.ok });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach Supabase.', detail: String(err) });
  }
};
