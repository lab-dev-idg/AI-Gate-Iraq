# Support Operations

## Contact

Primary technical support email: `support@idg.official.iq`

## Supported requests

- Access and authentication problems
- Platform errors and degraded functionality
- Conversion and pilot submission issues
- Data access, correction, or deletion requests
- Security reports
- Integration and technical documentation questions

## Triage priorities

| Priority | Definition | Initial response target |
| --- | --- | --- |
| P1 | Production unavailable, confirmed data exposure, or authentication bypass | As soon as operationally possible |
| P2 | Major workflow unavailable for multiple users | Same business day |
| P3 | Single-user defect with an available workaround | Within two business days |
| P4 | Guidance, documentation, or enhancement request | Within three business days |

Targets are operational goals, not contractual service-level agreements unless a separate written agreement exists.

## Required ticket information

- Requester name and company
- Reply email and optional phone number
- Affected URL and service
- Date, time, and timezone
- Browser, operating system, and device
- Reproduction steps
- Expected and actual result
- Screenshot with secrets and personal data removed
- Error code or visible message

## Security handling

Security reports are handled privately. Support staff must not request passwords, one-time codes, private keys, ID tokens, or full payment information. Sensitive findings must not be copied into public GitHub issues.

## Escalation

P1 and security reports are escalated to the platform owner. Firestore-rule, authentication, and production-hosting incidents require review of the affected commit, authorization configuration, and deployment history before closure.

## Closure record

A support case is closed only after resolution or an agreed workaround is communicated. The internal record should include classification, root cause, corrective action, responsible owner, and closure date.
