# Performance Testing Protocol

## Purpose

This protocol protects the public website and React platform from performance regressions while keeping the current Firebase Spark architecture unchanged.

## Scope

- Public website hosting
- React/Vite platform shell
- Firebase Authentication user flows
- Firestore reads and permitted writes
- Static assets, routing, and production availability

## Performance objectives

| Area | Release target |
| --- | --- |
| Website Lighthouse performance | Desktop >= 90, mobile >= 80 |
| Largest Contentful Paint | <= 2.5 seconds on a simulated 4G connection |
| Cumulative Layout Shift | <= 0.10 |
| Interaction to Next Paint | <= 200 ms where supported |
| Production HTTP p95 | <= 1,500 ms for static page requests |
| Failed HTTP requests | < 1% during the approved smoke test |
| Firestore operation p95 | <= 1,000 ms in Emulator or isolated test environment |

## Test levels

1. **Build gate**: TypeScript, project guard, and production build on every pull request.
2. **HTTP smoke test**: controlled read-only requests to both Firebase Hosting targets.
3. **Lighthouse audit**: performance, accessibility, best practices, and SEO budgets.
4. **Baseline load test**: 10 virtual users for 5 minutes against a non-production environment.
5. **Stress test**: gradual ramp-up only against Firebase Emulator Suite or an isolated test project.
6. **Soak test**: 30 minutes at expected baseline traffic before major releases.

## Safety controls

- Never run write-heavy load tests against production Firestore.
- Never create synthetic merchant, KYC, shipment, or conversion records in production.
- Use Firebase Emulator Suite or a dedicated non-production Firebase project for authenticated and write-path testing.
- Stop testing when the error rate exceeds 5%, p95 exceeds 3 seconds, or service stability is affected.
- Do not test third-party AI services beyond their documented quotas.

## Release evidence

Each performance run must record:

- Commit SHA
- Environment and URL
- Test date and operator
- Concurrency and duration
- p50, p95, maximum latency, and failure rate
- Lighthouse categories and Web Vitals
- Failed thresholds and corrective action

GitHub Actions artifacts are the source of evidence for automated runs.

## Failure handling

A failed performance gate blocks release. The responsible engineer must identify the largest regression, correct it, repeat the test, and attach the successful evidence before merge or deployment.
