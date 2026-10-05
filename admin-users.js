const crypto = require('crypto');
const { getSessionFromRequest } = require('./_session');
const { supaFetch, parseBody } = require('./_supabase');

const TABLE = 'ff_users';
const SALT = 'ff_secure_salt_2026_';
function hashPassword(plain) {
  return 'sha256:' + crypto.createHash('sha256').update(SALT + plain).digest('hex');
}

module.exports = async (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated.' }); return; }
  if (session.r !== 'admin') { res.status(403).json({ error: 'Only admins can manage users.' }); return; }

  try {
    if (req.method === 'GET') {
      const r = await supaFetch(`${TABLE}?select=id,username,role,created_at&order=created_at.asc`);
      res.status(r.status).json(await r.json());
      return;
    }

    if (req.method === 'POST') {
      const { username, password, role } = parseBody(req);
      if (!username || !password) { res.status(400).json({ error: 'username and password are required.' }); return; }
      const r = await supaFetch(TABLE, {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ id: username, username, password: hashPassword(password), role: role || 'editor' })
      });
      const data = await r.json();
      if (Array.isArray(data)) data.forEach(u => delete u.password);
      res.status(r.status).json(data);
      return;
    }

    if (req.method === 'PATCH') {
      const { id, password, role } = parseBody(req);
      if (!id) { res.status(400).json({ error: 'id is required.' }); return; }
      const fields = {};
      if (password) fields.password = hashPassword(password);
      if (role) fields.role = role;
      const r = await supaFetch(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(fields)
      });
      const data = await r.json();
      if (Array.isArray(data)) data.forEach(u => delete u.password);
      res.status(r.status).json(data);
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
