import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyHs256Jwt } from './jwt.ts';

const encode = (value: string): string => Buffer.from(value)
  .toString('base64url');

const sign = async (payload: Record<string, unknown>, secret: string): Promise<string> => {
  const header = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = encode(JSON.stringify(payload));
  const input = `${header}.${body}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(input));
  return `${input}.${Buffer.from(signature).toString('base64url')}`;
};

test('accepts a valid ZainCash HS256 callback', async () => {
  const token = await sign({ orderId: 'order-1', status: 'SUCCESS', exp: Math.floor(Date.now() / 1000) + 60 }, 'secret');
  const payload = await verifyHs256Jwt(token, 'secret');
  assert.equal(payload.orderId, 'order-1');
  assert.equal(payload.status, 'SUCCESS');
});

test('rejects a callback signed with another secret', async () => {
  const token = await sign({ orderId: 'order-1', status: 'SUCCESS' }, 'wrong-secret');
  await assert.rejects(() => verifyHs256Jwt(token, 'secret'), /JWT_INVALID_SIGNATURE/);
});

test('rejects an expired callback', async () => {
  const token = await sign({ orderId: 'order-1', exp: Math.floor(Date.now() / 1000) - 120 }, 'secret');
  await assert.rejects(() => verifyHs256Jwt(token, 'secret'), /JWT_EXPIRED/);
});
