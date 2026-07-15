import { handlePaymentRequest, type PaymentWorkerEnv } from './payments/worker-api';

interface AssetFetcher {
  fetch(request: Request): Promise<Response>;
}

interface R2BucketBinding {
  list(options: { limit: number }): Promise<unknown>;
}

interface Env extends PaymentWorkerEnv {
  ASSETS: AssetFetcher;
  STORAGE_BUCKET: R2BucketBinding;
}

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const paymentResponse = await handlePaymentRequest(request, env);
    if (paymentResponse) return paymentResponse;

    if (url.pathname === '/api/storage-health') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(null, {
          status: 405,
          headers: { Allow: 'GET, HEAD' },
        });
      }

      try {
        await env.STORAGE_BUCKET.list({ limit: 1 });

        if (request.method === 'HEAD') {
          return new Response(null, {
            status: 204,
            headers: { 'Cache-Control': 'no-store' },
          });
        }

        return json({
          status: 'ok',
          service: 'cloudflare-r2',
          binding: 'STORAGE_BUCKET',
          bucket: 'ai-gate-iraq-storage',
        });
      } catch (error) {
        console.error('R2 storage health check failed', {
          message: error instanceof Error ? error.message : 'Unknown error',
        });

        return json(
          {
            status: 'error',
            service: 'cloudflare-r2',
            code: 'R2_UNAVAILABLE',
          },
          503,
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
