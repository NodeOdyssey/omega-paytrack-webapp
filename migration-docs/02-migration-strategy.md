# Migration Strategy: PSCPL Payroll Webapp to Clean Architecture

## Table of Contents

1. [Overview](#overview)
2. [Migration Approach](#migration-approach)
3. [Phase-by-Phase Plan](#phase-by-phase-plan)
4. [Detailed Migration Steps](#detailed-migration-steps)
5. [Feature Migration Guide](#feature-migration-guide)
6. [Testing Strategy](#testing-strategy)
7. [Rollback Plan](#rollback-plan)
8. [Timeline](#timeline)

---

## Overview

This document provides a comprehensive migration strategy to transform the PSCPL Payroll Webapp from a traditional React/Vite application to a Clean Architecture-based Next.js application, following the patterns established in the Spotter Admin Webapp.

### Migration Goals

1. **Adopt Clean Architecture**: Implement layered architecture (Domain, Application, Infrastructure, Presentation)
2. **Migrate to Next.js**: Move from React Router to Next.js App Router
3. **Improve Type Safety**: Replace Yup with Zod for validation
4. **Separate Concerns**: Extract business logic from components/stores
5. **Enhance Testability**: Make code testable through proper layering
6. **Maintain Functionality**: Ensure all existing features continue to work

### Migration Principles

- ✅ **Incremental**: Migrate feature by feature, not all at once
- ✅ **Non-Breaking**: Old and new code coexist during migration
- ✅ **Tested**: Add tests before and during migration
- ✅ **Documented**: Document patterns and decisions
- ✅ **Reversible**: Ability to rollback if needed

---

## Migration Approach

### Strategy: Parallel Development

We'll use a **parallel development** approach:

1. **Create new Next.js app** alongside existing Vite app
2. **Migrate features incrementally** from old to new
3. **Run both apps** during migration period
4. **Switch routing** to new app when ready
5. **Remove old app** after full migration

### Migration Order

Features will be migrated in this order (from simplest to most complex):

1. **Foundation** (Week 1)
   - Project setup
   - Infrastructure layer
   - Shared utilities

2. **Authentication** (Week 1-2)
   - Login/Logout
   - Token management
   - Protected routes

3. **Employee Management** (Week 2-3)
   - List employees
   - Create/Update/Delete
   - Employee details

4. **Organization** (Week 3-4)
   - Ranks
   - Posts
   - Employee assignments

5. **Attendance & Payroll** (Week 4-5)
   - Attendance tracking
   - Payroll calculations

6. **Reports** (Week 5-6)
   - Report generation
   - PDF/Excel export

7. **Polish & Optimization** (Week 6-7)
   - Performance optimization
   - Testing
   - Documentation

---

## Phase-by-Phase Plan

### Phase 1: Foundation (Week 1)

#### 1.1 Project Setup

**Tasks:**
- [ ] Initialize Next.js 16 project
- [ ] Install dependencies (Zod, React Hook Form, Zustand, Axios, shadcn/ui)
- [ ] Set up TypeScript with strict mode
- [ ] Configure path aliases
- [ ] Set up ESLint rules for Clean Architecture
- [ ] Create folder structure

**Folder Structure:**
```
pscpl-payroll-webapp-client/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── presentation/          # UI layer
│   ├── application/           # Business logic
│   ├── domain/                # Domain entities
│   ├── infrastructure/        # External services
│   └── shared/                # Shared utilities
```

**Deliverables:**
- ✅ Next.js project initialized
- ✅ Folder structure created
- ✅ Dependencies installed
- ✅ TypeScript configured

#### 1.2 Infrastructure Layer

**Tasks:**
- [ ] Create HTTP client with interceptors
- [ ] Set up error handling (ApiError, AuthError, ValidationError)
- [ ] Create storage utilities (localStorage, cookie)
- [ ] Set up API endpoints structure
- [ ] Configure environment variables

**Files to Create:**
```
src/infrastructure/
├── http/
│   ├── axios-client.ts
│   └── endpoints/
│       └── base-endpoint.ts
├── storage/
│   ├── local-storage.ts
│   └── cookie-storage.ts
└── services/
```

**Deliverables:**
- ✅ HTTP client configured
- ✅ Error classes created
- ✅ Storage utilities ready
- ✅ Base endpoint class created

#### 1.3 Shared Layer

**Tasks:**
- [ ] Create constants (API routes, app routes)
- [ ] Set up error classes
- [ ] Create utility functions
- [ ] Define shared types

**Files to Create:**
```
src/shared/
├── constants/
│   ├── api-routes.ts
│   └── app-routes.ts
├── errors/
│   ├── api-error.ts
│   ├── auth-error.ts
│   └── validation-error.ts
└── utils/
```

**Deliverables:**
- ✅ Constants defined
- ✅ Error classes ready
- ✅ Utilities available

---

### Phase 2: Authentication (Week 1-2)

#### 2.1 Domain Layer

**Tasks:**
- [ ] Create User entity
- [ ] Define AuthRepository interface
- [ ] Create value objects (Email, etc.)

**Files:**
```
src/domain/
├── entities/
│   └── user.entity.ts
├── repositories/
│   └── auth-repository.interface.ts
└── value-objects/
    └── email.vo.ts
```

#### 2.2 Application Layer

**Tasks:**
- [ ] Create auth DTOs with Zod schemas
- [ ] Implement login use case
- [ ] Implement logout use case
- [ ] Create auth mappers

**Files:**
```
src/application/
├── dtos/
│   └── auth/
│       ├── login.dto.ts
│       └── logout.dto.ts
├── use-cases/
│   └── auth/
│       ├── login-use-case.ts
│       └── logout-use-case.ts
└── mappers/
    └── auth.mapper.ts
```

#### 2.3 Infrastructure Layer

**Tasks:**
- [ ] Create AuthEndpoints class
- [ ] Implement HttpAuthRepository
- [ ] Set up token refresh interceptor

**Files:**
```
src/infrastructure/
├── http/
│   └── endpoints/
│       └── auth-endpoints.ts
└── repositories/
    └── http-auth-repository.ts
```

#### 2.4 Presentation Layer

**Tasks:**
- [ ] Create auth store (UI state only)
- [ ] Create use-login hook
- [ ] Create use-logout hook
- [ ] Build login form component
- [ ] Create auth layout
- [ ] Set up protected routes middleware

**Files:**
```
src/presentation/
├── stores/
│   └── auth-store.ts
├── hooks/
│   └── auth/
│       ├── use-login.ts
│       └── use-logout.ts
└── components/
    └── auth/
        └── login-form.tsx
```

#### 2.5 App Router Integration

**Tasks:**
- [ ] Create (auth) route group
- [ ] Create (main) route group with layout
- [ ] Set up authentication middleware
- [ ] Create login page

**Files:**
```
src/app/
├── (auth)/
│   ├── layout.tsx
│   └── login/
│       └── page.tsx
└── (main)/
    ├── layout.tsx
    └── dashboard/
        └── page.tsx
```

**Deliverables:**
- ✅ Authentication fully migrated
- ✅ Login/logout working
- ✅ Protected routes implemented
- ✅ Token management configured

---

### Phase 3: Employee Management (Week 2-3)

#### 3.1 Domain Layer

**Tasks:**
- [ ] Create Employee entity
- [ ] Define EmployeeRepository interface
- [ ] Create value objects (Phone, Address, etc.)

**Files:**
```
src/domain/
├── entities/
│   └── employee.entity.ts
└── repositories/
    └── employee-repository.interface.ts
```

#### 3.2 Application Layer

**Tasks:**
- [ ] Create employee DTOs
- [ ] Implement CRUD use cases
  - GetEmployeesUseCase
  - GetEmployeeByIdUseCase
  - CreateEmployeeUseCase
  - UpdateEmployeeUseCase
  - DeleteEmployeeUseCase
- [ ] Create employee mapper

**Files:**
```
src/application/
├── dtos/
│   └── employee/
│       ├── employee.dto.ts
│       ├── create-employee.dto.ts
│       └── update-employee.dto.ts
└── use-cases/
    └── employee/
        ├── get-employees-use-case.ts
        ├── get-employee-by-id-use-case.ts
        ├── create-employee-use-case.ts
        ├── update-employee-use-case.ts
        └── delete-employee-use-case.ts
```

#### 3.3 Infrastructure Layer

**Tasks:**
- [ ] Create EmployeeEndpoints
- [ ] Implement HttpEmployeeRepository

**Files:**
```
src/infrastructure/
├── http/
│   └── endpoints/
│       └── employee-endpoints.ts
└── repositories/
    └── http-employee-repository.ts
```

#### 3.4 Presentation Layer

**Tasks:**
- [ ] Create employee store (UI state)
- [ ] Create hooks (use-employees, use-employee, use-create-employee, etc.)
- [ ] Build employee list component
- [ ] Build employee form component
- [ ] Build employee details component
- [ ] Create employee pages

**Files:**
```
src/presentation/
├── stores/
│   └── employee-store.ts
├── hooks/
│   └── employee/
│       ├── use-employees.ts
│       ├── use-employee.ts
│       ├── use-create-employee.ts
│       ├── use-update-employee.ts
│       └── use-delete-employee.ts
└── components/
    └── employee/
        ├── employee-list.tsx
        ├── employee-form.tsx
        ├── employee-details.tsx
        └── employees-main.tsx
```

**Deliverables:**
- ✅ Employee CRUD operations migrated
- ✅ Employee forms with validation
- ✅ Employee list with pagination
- ✅ Employee details page

---

### Phase 4: Organization Features (Week 3-4)

#### 4.1 Ranks Management

**Tasks:**
- [ ] Create Rank entity
- [ ] Create rank DTOs and use cases
- [ ] Implement rank repository
- [ ] Build rank components
- [ ] Create rank pages

#### 4.2 Posts Management

**Tasks:**
- [ ] Create Post entity
- [ ] Create post DTOs and use cases
- [ ] Implement post repository
- [ ] Build post components
- [ ] Create post pages

#### 4.3 Employee Assignments

**Tasks:**
- [ ] Create assignment use cases
- [ ] Build assignment components
- [ ] Integrate with employee and post modules

**Deliverables:**
- ✅ Ranks management migrated
- ✅ Posts management migrated
- ✅ Employee assignments working

---

### Phase 5: Attendance & Payroll (Week 4-5)

#### 5.1 Attendance Management

**Tasks:**
- [ ] Create Attendance entity
- [ ] Create attendance DTOs and use cases
- [ ] Implement attendance repository
- [ ] Build attendance components
- [ ] Create attendance pages

#### 5.2 Payroll Management

**Tasks:**
- [ ] Create Payroll entity
- [ ] Create payroll DTOs and use cases
- [ ] Implement payroll calculations
- [ ] Build payroll components
- [ ] Create payroll pages

**Deliverables:**
- ✅ Attendance tracking migrated
- ✅ Payroll calculations working
- ✅ Attendance and payroll pages functional

---

### Phase 6: Reports (Week 5-6)

#### 6.1 Report Generation

**Tasks:**
- [ ] Create Report entity
- [ ] Create report DTOs and use cases
- [ ] Implement report repository
- [ ] Build report components
- [ ] Create report pages

#### 6.2 Export Functionality

**Tasks:**
- [ ] Create PDF export service (infrastructure)
- [ ] Create Excel export service (infrastructure)
- [ ] Integrate export with reports
- [ ] Build export UI

**Deliverables:**
- ✅ All report types migrated
- ✅ PDF export working
- ✅ Excel export working
- ✅ Report pages functional

---

### Phase 7: Polish & Optimization (Week 6-7)

#### 7.1 Testing

**Tasks:**
- [ ] Add unit tests for use cases
- [ ] Add component tests
- [ ] Add integration tests
- [ ] Add E2E tests for critical flows

#### 7.2 Performance Optimization

**Tasks:**
- [ ] Optimize bundle size
- [ ] Implement code splitting
- [ ] Add loading states
- [ ] Optimize images
- [ ] Add caching strategies

#### 7.3 Documentation

**Tasks:**
- [ ] Update README
- [ ] Document architecture
- [ ] Create developer guide
- [ ] Document API integration

#### 7.4 Cleanup

**Tasks:**
- [ ] Remove old Vite app
- [ ] Remove unused dependencies
- [ ] Clean up legacy code
- [ ] Update CI/CD pipelines

**Deliverables:**
- ✅ Tests added
- ✅ Performance optimized
- ✅ Documentation complete
- ✅ Legacy code removed

---

## Detailed Migration Steps

### Step 1: Migrate API Configuration

**Before (PSCPL):**
```typescript
// src/configs/api.ts
export const api = {
  baseUrl: 'https://purbanchalsecurity.com/paytrack/api/v1',
  login: '/auth/login',
  employees: '/employees',
};
```

**After (Spotter Pattern):**
```typescript
// src/shared/constants/api-routes.ts
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  EMPLOYEES: {
    BASE: '/employees',
    BY_ID: (id: number) => `/employees/${id}`,
  },
} as const;
```

### Step 2: Migrate HTTP Client

**Before (PSCPL):**
```typescript
// Direct axios usage in stores
const response = await axios.get(
  `${api.baseUrl}${api.employees}`,
  { headers: { 'x-access-token': accessToken } }
);
```

**After (Spotter Pattern):**
```typescript
// src/infrastructure/http/axios-client.ts
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// Request interceptor adds token
axiosClient.interceptors.request.use((config) => {
  const token = getToken(); // From cookie/localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    throw ApiError.fromAxiosError(error);
  }
);
```

### Step 3: Migrate Validation

**Before (PSCPL - Yup):**
```typescript
// src/validators/login.ts
import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
});
```

**After (Spotter Pattern - Zod):**
```typescript
// src/application/dtos/auth/login.dto.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
```

### Step 4: Migrate Store

**Before (PSCPL):**
```typescript
// src/store/auth.ts
export const useAuthStore = create((set) => ({
  login: async (email, password) => {
    const response = await axios.post(`${api.baseUrl}${api.login}`, {
      email,
      password,
    });
    localStorage.setItem('accessToken', response.data.accessToken);
    set({ user: response.data.user });
  },
}));
```

**After (Spotter Pattern):**
```typescript
// src/presentation/stores/auth-store.ts (UI state only)
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);

// src/presentation/hooks/auth/use-login.ts (Business logic)
export function useLogin() {
  const { setAuth } = useAuthStore();
  
  const login = async (data: LoginRequest) => {
    const endpoints = new AuthEndpoints();
    const repository = new HttpAuthRepository(endpoints);
    const useCase = new LoginUseCase(repository);
    
    const user = await useCase.execute(data);
    setAuth(user);
  };
  
  return { login };
}
```

### Step 5: Migrate Component

**Before (PSCPL):**
```typescript
// src/scenes/Dashboard/Organization/EmployeeDetails/components/AddEmployeeForm.tsx
const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({});
  const { addEmployee } = useEmployeeStore();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEmployee(formData, accessToken);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

**After (Spotter Pattern):**
```typescript
// src/presentation/components/employee/employee-form.tsx
export function EmployeeForm({ onSubmit, isLoading }: EmployeeFormProps) {
  const form = useForm<CreateEmployeeDTO>({
    resolver: zodResolver(createEmployeeSchema),
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}

// src/presentation/components/employee/employees-main.tsx
export function EmployeesMain() {
  const { createEmployee, isLoading } = useCreateEmployee();
  
  return (
    <EmployeeForm 
      onSubmit={createEmployee}
      isLoading={isLoading}
    />
  );
}
```

---

## Feature Migration Guide

### Template for Migrating Any Feature

1. **Domain Layer**
   - [ ] Create entity class
   - [ ] Define repository interface
   - [ ] Create value objects if needed

2. **Application Layer**
   - [ ] Create DTOs with Zod schemas
   - [ ] Implement use cases
   - [ ] Create mappers (entity ↔ DTO)

3. **Infrastructure Layer**
   - [ ] Create endpoints class
   - [ ] Implement repository

4. **Presentation Layer**
   - [ ] Create store (UI state only)
   - [ ] Create hooks (orchestrate use cases)
   - [ ] Build components (dumb components)
   - [ ] Create pages (thin wrappers)

5. **Testing**
   - [ ] Unit tests for use cases
   - [ ] Component tests
   - [ ] Integration tests

---

## Testing Strategy

### Unit Tests

**Target Coverage:**
- Use cases: 80%+
- Domain entities: 90%+
- Utilities: 80%+

**Tools:**
- Vitest for unit tests
- Testing Library for component tests

### Integration Tests

**Target Coverage:**
- API integration: 70%+
- Repository implementations: 80%+

### E2E Tests

**Critical Paths:**
- Login flow
- Employee CRUD
- Report generation
- Export functionality

**Tools:**
- Playwright or Cypress

---

## Rollback Plan

### If Migration Fails

1. **Keep old app running**: Don't remove Vite app until migration complete
2. **Feature flags**: Use feature flags to switch between old/new
3. **Database compatibility**: Ensure API remains compatible
4. **Gradual rollout**: Migrate one feature at a time

### Rollback Steps

1. Revert routing to old app
2. Keep new code for reference
3. Fix issues in old app if needed
4. Plan re-migration after fixes

---

## Timeline

### Week 1: Foundation
- Project setup
- Infrastructure layer
- Authentication (partial)

### Week 2: Authentication Complete
- Complete authentication
- Start employee management

### Week 3: Employee Management
- Complete employee CRUD
- Start organization features

### Week 4: Organization Features
- Ranks and Posts
- Employee assignments

### Week 5: Attendance & Payroll
- Attendance tracking
- Payroll calculations

### Week 6: Reports
- Report generation
- Export functionality

### Week 7: Polish & Optimization
- Testing
- Performance optimization
- Documentation
- Cleanup

---

## Success Criteria

### Technical Criteria
- ✅ All features migrated
- ✅ Tests passing (80%+ coverage)
- ✅ No performance regression
- ✅ Type safety maintained
- ✅ Error handling consistent

### Business Criteria
- ✅ All existing features working
- ✅ No user-facing changes (same UX)
- ✅ Improved developer experience
- ✅ Easier to add new features

---

## Next Steps

1. **Review this strategy** with the team
2. **Set up migration branch** in Git
3. **Start Phase 1** (Foundation)
4. **Daily standups** to track progress
5. **Weekly reviews** to adjust plan

---

**See Also:**
- [Comparative Analysis](./01-comparative-analysis.md)
- [Migration Checklist](./03-migration-checklist.md)
- [Architecture Guide](../spotter-gym-management/spotter-source-codes/spotter-admin-webapp/docs/architecture/nextjs-clean-architecture-guide.md)
