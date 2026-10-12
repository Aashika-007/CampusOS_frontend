# CampusOS frontend starter

React + Vite prototype for the CampusOS technical-event approval workflow.

## Run locally
1. Install Node.js (LTS).
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local URL printed by Vite.

## Demo roles
Use the role selector in the top header to switch between:
- Student: dashboard, new event request, request history
- Proctor: assigned review queue
- Administrator: overview, attendance import, review queue

The role selector and route checks are **frontend demo behavior only**. They are not authentication or a security boundary. Before real use, connect Firebase Authentication and enforce role-based access in Firestore Security Rules and trusted Cloud Functions.

## Reusable feedback states
`src/components/common/StateViews.jsx` exports:
- `LoadingState`
- `ErrorState`
- `EmptyState`
- `SuccessState`

Example:
```jsx
import { LoadingState, ErrorState, EmptyState, SuccessState } from '../components/common/StateViews.jsx'

if (loading) return <LoadingState />
if (error) return <ErrorState onRetry={loadAgain} />
if (!items.length) return <EmptyState title="No requests yet" message="Create your first request to get started." />
return <SuccessState title="Loaded" message="Your data is ready." />
```

## Next steps
1. Confirm the app builds and all pages navigate.
2. Agree the Firestore request/attendance schema with the backend teammate.
3. Replace the demo role selector with Firebase Authentication and roles loaded from trusted user records.
4. Move reads/writes into shared service modules; do not let the frontend decide final approval.
5. Connect the attendance CSV/XLSX importer to the backend import flow and validation.
6. Test each role, empty/error/loading states, responsive layout, and unauthorized routes.
7. Deploy a preview early, then update the README with setup instructions and demo credentials (never commit secrets).
