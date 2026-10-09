// Edge-compatible auth helper — uses ONLY Web Crypto API (no Buffer, no Node.js)
// کار می‌کند در: Edge Runtime (middleware) + Node.js (API routes)

const PAYLOAD = 'admin-authenticated-v1';

function getSecret(): string {
  const s = process.env.ADMIN_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_SECRET environment variable is not set!');
    }
    return 'dev-fallback-secret-change-in-production';
  }
  return s;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/** تبدیل ArrayBuffer به base64url — بدون Buffer */
function bufToBase64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/** تبدیل base64url به Uint8Array — بدون Buffer */
function base64urlToUint8(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const str = atob(padded);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

/** توکن جلسه — stateless، بر اساس ADMIN_SECRET */
export async function createSessionToken(): Promise<string> {
  const key = await getHmacKey(getSecret());
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(PAYLOAD)
  );
  return bufToBase64url(sig);
}

/** verify توکن با Web Crypto constant-time compare */
export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const key = await getHmacKey(getSecret());
    const receivedBytes = base64urlToUint8(token);
    return await crypto.subtle.verify(
      'HMAC',
      key,
      receivedBytes,
      new TextEncoder().encode(PAYLOAD)
    );
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 روز
