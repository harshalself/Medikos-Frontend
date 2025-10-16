# Medikos Frontend

Healthcare platform frontend built with React, TypeScript, and Vite.

## Backend Integration Plan

### Overview
This plan outlines the minimal steps required to integrate the React frontend with the backend API running on `http://localhost:8000`.

### Phase 1: Environment & Configuration Setup

#### 1.1 Environment Variables
**File**: `.env.local` (create new)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

**Why**: Centralize API URL configuration, easy to change for different environments (dev/staging/prod).

#### 1.2 Vite Proxy Configuration
**File**: `vite.config.ts` (update)
- Add proxy configuration to avoid CORS issues during development
- Proxy `/api/*` requests to `http://localhost:8000`

**Why**: Eliminates CORS errors in development, no need for backend CORS configuration.

---

### Phase 2: API Layer Setup (Minimal Approach)

#### 2.1 Create API Client
**File**: `src/lib/api.ts` (create new)
- Simple fetch wrapper with base URL
- Handles authentication tokens
- Error handling in one place
- Request/response interceptors

**Why**: Single source of truth for all API calls, consistent error handling.

#### 2.2 API Configuration
**File**: `src/lib/api-config.ts` (create new)
- Export base URL from environment
- Export common headers
- Export API endpoints as constants

**Why**: Type-safe endpoint references, easy to update API routes.

---

### Phase 3: Authentication Integration

#### 3.1 Update Auth Context
**File**: `src/contexts/AuthContext.tsx` (update)
- Connect login/logout to real API endpoints
- Store JWT token in localStorage
- Add token refresh logic
- Add interceptor to attach token to requests

**Why**: Centralized auth state management, automatic token handling.

#### 3.2 Update Login Page
**File**: `src/pages/Login.tsx` (update)
- Connect form submission to API
- Handle loading and error states
- Redirect on successful login

**Why**: Real authentication instead of mock data.

---

### Phase 4: API Hooks (React Query)

#### 4.1 Create Custom Hooks
**Files**: `src/hooks/api/` (create new directory)
- `useAuth.ts` - Login, logout, register
- `usePatients.ts` - Patient CRUD operations
- `useAppointments.ts` - Appointment management
- `useDoctors.ts` - Doctor data
- `useHealthRecords.ts` - Health records and diaries

**Why**: React Query handles caching, loading states, refetching automatically.

#### 4.2 Query Client Setup
**File**: `src/main.tsx` (update)
- Already has `@tanstack/react-query` installed
- Configure default options (retry, staleTime, cacheTime)

**Why**: Optimize API calls, reduce unnecessary requests.

---

### Phase 5: Gradual Page Migration

#### 5.1 Priority Order (migrate one at a time)
1. **Login Page** - Authentication first
2. **Dashboard** - Overview data
3. **Appointments** - Core functionality
4. **Health Diary** - User input/output
5. **Doctor Pages** - Doctor-specific features
6. **Admin Dashboard** - Admin features

**Why**: Incremental approach reduces risk, easier to test.

#### 5.2 Migration Pattern per Page
For each page:
- Replace mock data with API hook
- Add loading skeletons
- Add error boundaries
- Update form submissions to API calls

**Why**: Consistent implementation across all pages.

---

### Phase 6: Error Handling & Loading States

#### 6.1 Global Error Handler
**File**: `src/components/ErrorBoundary.tsx` (create new)
- Catch and display API errors
- Provide retry functionality

#### 6.2 Loading Components
**Files**: `src/components/ui/` (use existing)
- Use existing `skeleton.tsx` for loading states
- Add `LoadingSpinner` component if needed

**Why**: Better UX during API calls.

---

### File Structure Summary

```
src/
├── lib/
│   ├── api.ts              # API client (fetch wrapper)
│   ├── api-config.ts       # API endpoints & config
│   └── utils.ts            # (existing)
├── hooks/
│   └── api/
│       ├── useAuth.ts
│       ├── usePatients.ts
│       ├── useAppointments.ts
│       ├── useDoctors.ts
│       └── useHealthRecords.ts
├── contexts/
│   ├── AuthContext.tsx     # (update for real API)
│   └── ...
├── components/
│   ├── ErrorBoundary.tsx   # (create)
│   └── ...
└── pages/
    └── ...                 # (update gradually)
```

---

### Implementation Checklist

- [ ] Create `.env.local` file
- [ ] Update `vite.config.ts` with proxy
- [ ] Create `src/lib/api.ts` (API client)
- [ ] Create `src/lib/api-config.ts` (endpoints)
- [ ] Update `AuthContext.tsx` for real API
- [ ] Update `Login.tsx` page
- [ ] Create API hooks in `src/hooks/api/`
- [ ] Create `ErrorBoundary.tsx`
- [ ] Migrate Dashboard page
- [ ] Migrate Appointments page
- [ ] Migrate Health Diary page
- [ ] Migrate Doctor pages
- [ ] Migrate Admin Dashboard
- [ ] Test all features end-to-end
- [ ] Add proper error messages
- [ ] Add loading states everywhere

---

### Estimated Lines of Code

| Component | Estimated LOC |
|-----------|---------------|
| API Client | ~100 lines |
| API Config | ~50 lines |
| Auth Context Updates | ~50 lines |
| API Hooks (all) | ~300 lines |
| Error Boundary | ~40 lines |
| Page Updates | ~500 lines total |
| **Total** | **~1040 lines** |

---

### Benefits of This Approach

1. **Minimal Code**: Reusing existing components and libraries
2. **Type Safety**: TypeScript ensures API contracts
3. **Automatic Caching**: React Query handles it
4. **Error Handling**: Centralized and consistent
5. **Easy Testing**: Hooks can be mocked easily
6. **Gradual Migration**: No big bang deployment
7. **Developer Experience**: Hot reload, type hints, autocomplete

---

## Development Setup

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Backend API running on `http://localhost:8000`

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd Medikos-Frontend

# Install dependencies
npm i

# Create environment file
cp .env.example .env.local
# Edit .env.local with your backend URL

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server (http://localhost:8080)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Routing**: React Router
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/eb7be595-26e2-4f4f-b11b-e6021d001a43) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
