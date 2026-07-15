const encoder = new TextEncoder();

const base64UrlToBytes = (value: string): Uint8Array => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const decoded = atob(padded);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
};

const bytesToBase64Url = (value: Uint8Array): string => {
  let binary = '';
  value.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const parseJsonPart = <T>(part: string): T => {
  const decoded = new TextDecoder().decode(base64UrlToBytes(part));
  return JSON.parse(decoded) as T;
};

const validateJwtTimeClaims = (payload: Record<string, unknown>): void => {
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === 'number' && payload.exp < now - 30) throw new Error('JWT_EXPIRED');
  if (typeof payload.nbf === 'number' && payload.nbf > now + 30) throw new Error('JWT_NOT_ACTIVE');
};

export async function verifyHs256Jwt<T extends Record<string, unknown>>(
  token: string,
  secret: string,
): Promise<T> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('JWT_INVALID_FORMAT');

  const header = parseJsonPart<Record<string, unknown>>(parts[0]);
  if (header.alg !== 'HS256') throw new Error('JWT_INVALID_ALGORITHM');

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlToBytes(parts[2]),
    encoder.encode(`${parts[0]}.${parts[1]}`),
  );
  if (!valid) throw new Error('JWT_INVALID_SIGNATURE');

  const payload = parseJsonPart<T>(parts[1]);
  validateJwtTimeClaims(payload);
  return payload;
}

const pemToPkcs8 = (pem: string): ArrayBuffer => {
  const normalized = pem.replace(/\\n/g, '\n');
  const beginMarker = ['-----BEGIN', 'PRIVATE KEY-----'].join(' ');
  const endMarker = ['-----END', 'PRIVATE KEY-----'].join(' ');
  const body = normalized
    .replace(beginMarker, '')
    .replace(endMarker, '')
    .replace(/\s/g, '');
  return base64UrlToBytes(body.replace(/\+/g, '-').replace(/\//g, '_')).buffer;
};

export async function createRs256Jwt(
  payload: Record<string, unknown>,
  privateKeyPem: string,
): Promise<string> {
  const header = bytesToBase64Url(encoder.encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })));
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const input = `${header}.${body}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToPkcs8(privateKeyPem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(input));
  return `${input}.${bytesToBase64Url(new Uint8Array(signature))}`;
}
