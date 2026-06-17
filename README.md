# AI Gate Iraq

AI Gate Iraq is a privately owned commercial service platform for Iraqi traders, SMEs, importers, exporters, logistics operators, procurement teams, founders, and service providers.

## Core services

- AI Business Advisor
- Market and trade guidance
- Border and logistics planning
- Currency conversion and cost estimation
- Business account onboarding
- Procurement and sourcing requests
- Shipment records associated with authenticated user accounts
- Public service inquiries stored in Firestore

## Security and runtime

- Firebase Authentication with Google sign-in
- Firestore rules protected by `adminUsers/{uid}` authorization
- Server-side Gemini API proxy
- No client-side Gemini secret
- No mock authentication or fabricated shipment records
- File uploads remain disabled until Firebase Storage is enabled

## Local verification

```bash
npm run check:project
npm run lint
npm run build
```
