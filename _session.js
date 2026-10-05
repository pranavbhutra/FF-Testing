const crypto = require('crypto');

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const COOKIE_NAME = 'ff_admin_session';

function getSecret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error('ADMIN_SESSION_SECRET env var is not set');
  return s;
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const mac = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url');
  return `${body}.${mac}`;
}

function verify(token) {
  if (!token || !token.includes('.')) return null;
  const [body, mac] = token.split('.');
  const expectedMac = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url');
  const macBuf = Buffer.from(mac);
  const expBuf = Buffer.from(expectedMac);
  if (macBuf.length !== expBuf.length || !crypto.timingSafeEqual(macBuf, expBuf)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function createSessionCookie(username, role) {
  const token = sign({ u: username, r: role || 'editor', exp: Date.now() + SESSION_TTL_MS });
  const secure = process.env.VERCEL ? 'Secure; ' : '';
  return `${COOKIE_NAME}=${token}; HttpOnly; ${secure}SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}

function getSessionFromRequest(req) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  return verify(match.slice(COOKIE_NAME.length + 1));
}

module.exports = { createSessionCookie, clearSessionCookie, getSessionFromRequest, COOKIE_NAME };
