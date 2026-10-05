const { getSessionFromRequest } = require('./_session');

module.exports = async (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated.' }); return; }
  res.status(200).json({ ok: true, username: session.u, role: session.r });
};
