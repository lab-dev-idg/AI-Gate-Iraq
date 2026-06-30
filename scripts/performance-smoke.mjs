const targets = [
  'https://ai-gate-iraq-website.web.app/',
  'https://ai-gate-iraq-platform.web.app/',
];

const requestsPerTarget = Number.parseInt(process.env.PERF_REQUESTS || '10', 10);
const concurrency = Number.parseInt(process.env.PERF_CONCURRENCY || '5', 10);
const timeoutMs = Number.parseInt(process.env.PERF_TIMEOUT_MS || '10000', 10);
const p95BudgetMs = Number.parseInt(process.env.PERF_P95_BUDGET_MS || '1500', 10);
const maxFailureRate = Number.parseFloat(process.env.PERF_MAX_FAILURE_RATE || '0.01');

if (!Number.isFinite(requestsPerTarget) || requestsPerTarget < 1) throw new Error('PERF_REQUESTS must be a positive integer.');
if (!Number.isFinite(concurrency) || concurrency < 1) throw new Error('PERF_CONCURRENCY must be a positive integer.');

function percentile(values, percentage) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((percentage / 100) * sorted.length) - 1);
  return sorted[index];
}

async function request(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = performance.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'user-agent': 'AI-Gate-Iraq-Performance-Smoke/1.0' },
    });

    const durationMs = performance.now() - startedAt;
    await response.arrayBuffer();
    return { ok: response.ok, status: response.status, durationMs };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      durationMs: performance.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function runTarget(url) {
  const results = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < requestsPerTarget) {
      nextIndex += 1;
      results.push(await request(url));
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, requestsPerTarget) }, worker));

  const durations = results.map((result) => result.durationMs);
  const failures = results.filter((result) => !result.ok);
  const failureRate = failures.length / results.length;
  const summary = {
    url,
    requests: results.length,
    failures: failures.length,
    failureRate,
    p50Ms: Math.round(percentile(durations, 50)),
    p95Ms: Math.round(percentile(durations, 95)),
    maxMs: Math.round(Math.max(...durations)),
    statuses: [...new Set(results.map((result) => result.status))],
  };

  console.log(JSON.stringify(summary));

  if (summary.p95Ms > p95BudgetMs) {
    throw new Error(`${url} p95 ${summary.p95Ms}ms exceeded ${p95BudgetMs}ms budget.`);
  }

  if (failureRate > maxFailureRate) {
    throw new Error(`${url} failure rate ${(failureRate * 100).toFixed(2)}% exceeded ${(maxFailureRate * 100).toFixed(2)}%.`);
  }
}

for (const target of targets) {
  await runTarget(target);
}
