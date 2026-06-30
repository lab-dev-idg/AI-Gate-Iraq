# Security Audit Protocol

## Security objective

AI Gate Iraq must protect authentication data, merchant submissions, administrative operations, configuration, and production assets without introducing a separate backend or paid Firebase services.

## Audit coverage

- Firebase Authentication configuration and authorized domains
- Firestore and Storage rules
- `adminUsers/{uid}` authorization model
- Public conversion submission permissions
- Administrative read and update permissions
- Client-side secret exposure
- Dependency vulnerabilities
- Cross-site scripting, injection, broken access control, and unsafe redirects
- Security headers and Firebase Hosting configuration
- Logging, incident response, and recovery procedures

## Required review cycle

- Automated checks on every pull request
- Manual security review before every major release
- Firestore rules review whenever collections or administrative fields change
- External penetration test before processing high-risk production data or onboarding large institutional customers
- Immediate review after any security incident or critical dependency advisory

## Automated controls

1. TypeScript and production build validation.
2. `npm audit --audit-level=high` as an advisory dependency gate.
3. Secret-pattern scan over tracked source files.
4. Project guard verification for forbidden infrastructure and production references.
5. Firebase rules unit tests when permission logic changes.
6. CodeQL analysis through GitHub Actions where repository permissions allow it.

## Manual test checklist

### Authentication

- Confirm unauthenticated users cannot access admin routes or protected Firestore documents.
- Confirm disabled or unlisted administrators are rejected.
- Confirm forced token refresh occurs before privileged Firestore operations.
- Confirm logout invalidates the active UI session.

### Firestore authorization

- Confirm public users can only create permitted conversion submissions.
- Confirm public users cannot list, read, update, or delete submissions.
- Confirm administrators can update only `status`, `adminNote`, `assignedTo`, and `updatedAt`.
- Confirm attempts to alter immutable fields return `permission-denied`.

### Browser security

- Test reflected and stored XSS payloads in every text field.
- Test URL and redirect parameters against open redirects.
- Confirm external links use `rel="noopener noreferrer"`.
- Confirm no API key with privileged capability, service-account key, or private credential exists in the client bundle.

### Abuse resistance

- Test repeated public submissions and document the practical rate-limiting control available within the current architecture.
- Validate input length, format, and required fields on client and rules layers where possible.
- Confirm administrative error messages do not expose tokens or internal configuration.

## Severity and release policy

| Severity | Example | Release decision |
| --- | --- | --- |
| Critical | Authentication bypass, public data read, exposed privileged secret | Block immediately |
| High | Unauthorized update, stored XSS, unsafe admin action | Block release |
| Medium | Missing defensive header, excessive error detail | Fix before next planned release |
| Low | Minor hardening or documentation gap | Track with owner and due date |

## Responsible disclosure

Security reports must be sent to `support@idg.official.iq` with the affected URL, reproduction steps, impact, and contact information. Do not include real merchant data in a report.

## Evidence record

For each audit, retain the date, scope, commit SHA, tester, findings, severity, remediation commit, retest result, and final approval. Sensitive findings must not be published in a public issue.
