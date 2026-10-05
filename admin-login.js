const crypto = require('crypto');
const { createSessionCookie } = require('./_session');

const SALT = 'ff_secure_salt_2026_';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cyugscorahdggfbmehpw.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE = 'ff_users';

function hashPassword(plain) {
  return 'sha256:' + crypto.createHash('sha256').update(SALT + plain).digest('hex');
}
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { username, password } = body || {};
  if (!username || !password) { res.status(400).json({ error: 'Username and password are required.' }); return; }

  if (!SERVICE_KEY) {
    res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server.' });
    return;
  }

  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    const lookup = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?username=eq.${encodeURIComponent(username)}&select=*`,
      { headers }
    );
    const rows = await lookup.json();
    const user = Array.isArray(rows) && rows.length ? rows[0] : null;

    if (!user) { res.status(401).json({ error: 'Invalid username or password.' }); return; }

    const stored = String(user.password || '');
    let passOk = false;

    if (stored.startsWith('sha256:')) {
      // Already hashed — normal path.
      passOk = safeEqual(hashPassword(password), stored);
    } else {
      // Legacy plaintext password still in the database. Verify directly,
      // then silently upgrade this row to a hashed password on success so
      // it never has to be stored in plaintext again.
      passOk = safeEqual(password, stored);
      if (passOk) {
        await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(user.id)}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ password: hashPassword(password) })
        }).catch(() => {}); // best-effort; login still succeeds even if this fails
      }
    }

    if (!passOk) { res.status(401).json({ error: 'Invalid username or password.' }); return; }

    const role = user.role || 'admin';
    res.setHeader('Set-Cookie', createSessionCookie(user.username, role));
    res.status(200).json({ ok: true, username: user.username, role });
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach Supabase.', detail: String(err) });
  }
};
