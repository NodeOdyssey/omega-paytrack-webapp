# Migration Checklist

This checklist provides a detailed, step-by-step guide for migrating the PSCPL Payroll Webapp to Clean Architecture. Use this checklist to track progress and ensure nothing is missed.

---

## Pre-Migration Preparation

### Planning
- [ ] Review comparative analysis document
- [ ] Review migration strategy document
- [ ] Get team alignment on architecture
- [ ] Set up migration branch (`git checkout -b migration/clean-architecture`)
- [ ] Create migration tracking board (Jira/Trello/etc.)
- [ ] Schedule migration kickoff meeting
- [ ] Document current features and functionality

### Environment Setup
- [ ] Set up development environment
- [ ] Install Node.js 18+ and pnpm
- [ ] Clone repository
- [ ] Install dependencies for current app
- [ ] Verify current app runs successfully
- [ ] Document current API endpoints
- [ ] Document current authentication flow

---

## Phase 1: Foundation (Week 1)

### 1.1 Project Setup

#### Next.js Project Initialization
- [ ] Create new Next.js 16 project (`npx create-next-app@latest`)
- [ ] Choose TypeScript
- [ ] Choose App Router
- [ ] Choose Tailwind CSS
- [ ] Choose ESLint
- [ ] Verify project runs (`pnpm dev`)

#### Dependencies Installation
- [ ] Install Zod (`pnpm add zod`)
- [ ] Install React Hook Form (`pnpm add react-hook-form @hookform/resolvers`)
- [ ] Install Zustand (`pnpm add zustand`)
- [ ] Install Axios (`pnpm add axios`)
- [ ] Install shadcn/ui (`pnpm dlx shadcn@latest init`)
- [ ] Install date-fns (`pnpm add date-fns`)
- [ ] Install Lucide React (`pnpm add lucide-react`)
- [ ] Install js-cookie (`pnpm add js-cookie @types/js-cookie`)
- [ ] Verify all dependencies installed correctly

#### TypeScript Configuration
- [ ] Update `tsconfig.json` with path aliases:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./src/*"],
        "@/presentation/*": ["./src/presentation/*"],
        "@/application/*": ["./src/application/*"],
        "@/domain/*": ["./src/domain/*"],
        "@/infrastructure/*": ["./src/infrastructure/*"],
        "@/shared/*": ["./src/shared/*"]
      }
    }
  }
  ```
- [ ] Enable strict mode in `tsconfig.json`
- [ ] Verify TypeScript compilation works

#### Folder Structure Creation
- [ ] Create `src/app/` directory
- [ ] Create `src/presentation/` directory
  - [ ] `src/presentation/components/`
  - [ ] `src/presentation/hooks/`
  - [ ] `src/presentation/stores/`
  - [ ] `src/presentation/design-system/`
- [ ] Create `src/application/` directory
  - [ ] `src/application/use-cases/`
  - [ ] `src/application/dtos/`
  - [ ] `src/application/services/`
  - [ ] `src/application/mappers/`
- [ ] Create `src/domain/` directory
  - [ ] `src/domain/entities/`
  - [ ] `src/domain/repositories/`
  - [ ] `src/domain/value-objects/`
- [ ] Create `src/infrastructure/` directory
  - [ ] `src/infrastructure/http/`
  - [ ] `src/infrastructure/repositories/`
  - [ ] `src/infrastructure/storage/`
  - [ ] `src/infrastructure/services/`
- [ ] Create `src/shared/` directory
  - [ ] `src/shared/constants/`
  - [ ] `src/shared/types/`
  - [ ] `src/shared/utils/`
  - [ ] `src/shared/errors/`

#### ESLint Configuration
- [ ] Create `.eslintrc.json` with Clean Architecture rules
- [ ] Add rule to prevent domain layer imports
- [ ] Add rule to prevent infrastructure imports in presentation
- [ ] Verify ESLint works

#### shadcn/ui Setup
- [ ] Initialize shadcn/ui (`pnpm dlx shadcn@latest init`)
- [ ] Configure `components.json`
- [ ] Add base components:
  - [ ] Button
  - [ ] Input
  - [ ] Form
  - [ ] Card
  - [ ] Dialog
  - [ ] Table
  - [ ] Select
  - [ ] Toast
- [ ] Verify components work

### 1.2 Infrastructure Layer

#### HTTP Client Setup
- [ ] Create `src/infrastructure/http/axios-client.ts`
- [ ] Configure base URL from environment variables
- [ ] Set up request interceptor
- [ ] Set up response interceptor
- [ ] Add error handling
- [ ] Test HTTP client with a simple request

#### Error Classes
- [ ] Create `src/shared/errors/api-error.ts`
- [ ] Create `src/shared/errors/auth-error.ts`
- [ ] Create `src/shared/errors/validation-error.ts`
- [ ] Create `src/shared/errors/app-error.ts`
- [ ] Add error handling utilities
- [ ] Test error classes

#### Storage Utilities
- [ ] Create `src/infrastructure/storage/local-storage.ts`
- [ ] Create `src/infrastructure/storage/cookie-storage.ts`
- [ ] Create `src/infrastructure/storage/session-storage.ts`
- [ ] Add type-safe storage methods
- [ ] Test storage utilities

#### Base Endpoint Class
- [ ] Create `src/infrastructure/http/endpoints/base-endpoint.ts`
- [ ] Implement GET, POST, PUT, PATCH, DELETE methods
- [ ] Add error handling
- [ ] Test base endpoint class

### 1.3 Shared Layer

#### Constants
- [ ] Create `src/shared/constants/api-routes.ts`
  - [ ] Migrate all API routes from `src/configs/api.ts`
  - [ ] Organize by feature
  - [ ] Add type safety
- [ ] Create `src/shared/constants/app-routes.ts`
  - [ ] Define all app routes
  - [ ] Add route helpers
- [ ] Create `src/shared/constants/roles.ts` (if applicable)
- [ ] Test constants

#### Utilities
- [ ] Migrate utility functions from `src/utils/`
- [ ] Create `src/shared/utils/date.utils.ts`
- [ ] Create `src/shared/utils/string.utils.ts`
- [ ] Create `src/shared/utils/number.utils.ts`
- [ ] Create `src/shared/utils/validation.utils.ts`
- [ ] Test utilities

#### Types
- [ ] Create `src/shared/types/api.types.ts`
- [ ] Create `src/shared/types/common.types.ts`
- [ ] Migrate shared types from `src/types/`
- [ ] Test types

---

## Phase 2: Authentication (Week 1-2)

### 2.1 Domain Layer

#### User Entity
- [ ] Create `src/domain/entities/user.entity.ts`
- [ ] Add user properties
- [ ] Add business logic methods (isAdmin, etc.)
- [ ] Test user entity

#### Auth Repository Interface
- [ ] Create `src/domain/repositories/auth-repository.interface.ts`
- [ ] Define login method
- [ ] Define logout method
- [ ] Define refreshToken method
- [ ] Define getCurrentUser method

#### Value Objects
- [ ] Create `src/domain/value-objects/email.vo.ts`
- [ ] Add email validation
- [ ] Test email value object

### 2.2 Application Layer

#### Auth DTOs
- [ ] Create `src/application/dtos/auth/login.dto.ts`
  - [ ] Create `loginSchema` with Zod
  - [ ] Export `LoginRequest` type
  - [ ] Export `LoginResponse` type
- [ ] Create `src/application/dtos/auth/logout.dto.ts`
- [ ] Create `src/application/dtos/auth/token.dto.ts`
- [ ] Test DTOs

#### Auth Use Cases
- [ ] Create `src/application/use-cases/auth/login-use-case.ts`
  - [ ] Inject repository
  - [ ] Validate input with Zod
  - [ ] Call repository
  - [ ] Return user entity
- [ ] Create `src/application/use-cases/auth/logout-use-case.ts`
- [ ] Create `src/application/use-cases/auth/refresh-token-use-case.ts`
- [ ] Test use cases

#### Auth Mapper
- [ ] Create `src/application/mappers/auth.mapper.ts`
- [ ] Implement `toDTO` method
- [ ] Implement `toEntity` method
- [ ] Test mapper

### 2.3 Infrastructure Layer

#### Auth Endpoints
- [ ] Create `src/infrastructure/http/endpoints/auth-endpoints.ts`
- [ ] Implement `login` method
- [ ] Implement `logout` method
- [ ] Implement `refreshToken` method
- [ ] Test endpoints

#### Auth Repository Implementation
- [ ] Create `src/infrastructure/repositories/http-auth-repository.ts`
- [ ] Implement `IAuthRepository` interface
- [ ] Use `AuthEndpoints` class
- [ ] Use mapper to convert DTOs to entities
- [ ] Test repository

### 2.4 Presentation Layer

#### Auth Store
- [ ] Create `src/presentation/stores/auth-store.ts`
- [ ] Add user state
- [ ] Add isAuthenticated state
- [ ] Add setAuth action
- [ ] Add logout action
- [ ] Add persist middleware
- [ ] Test store

#### Auth Hooks
- [ ] Create `src/presentation/hooks/auth/use-login.ts`
  - [ ] Use use case
  - [ ] Update store
  - [ ] Handle errors
  - [ ] Show toast notifications
- [ ] Create `src/presentation/hooks/auth/use-logout.ts`
- [ ] Create `src/presentation/hooks/auth/use-auth.ts`
- [ ] Test hooks

#### Login Form Component
- [ ] Create `src/presentation/components/auth/login-form.tsx`
- [ ] Use React Hook Form
- [ ] Use Zod resolver
- [ ] Use shadcn/ui components
- [ ] Integrate with use-login hook
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test component

#### Auth Layout
- [ ] Create `src/presentation/components/layouts/auth-layout.tsx`
- [ ] Add styling
- [ ] Test layout

### 2.5 App Router Integration

#### Auth Route Group
- [ ] Create `src/app/(auth)/layout.tsx`
- [ ] Create `src/app/(auth)/login/page.tsx`
- [ ] Test auth routes

#### Main Route Group
- [ ] Create `src/app/(main)/layout.tsx`
- [ ] Add authentication check
- [ ] Add sidebar/navbar
- [ ] Create `src/app/(main)/dashboard/page.tsx`
- [ ] Test protected routes

#### Middleware
- [ ] Create `src/middleware.ts`
- [ ] Add authentication check
- [ ] Add redirect logic
- [ ] Test middleware

### 2.6 Testing Authentication

- [ ] Unit test login use case
- [ ] Unit test logout use case
- [ ] Component test login form
- [ ] Integration test login flow
- [ ] E2E test login/logout

---

## Phase 3: Employee Management (Week 2-3)

### 3.1 Domain Layer

#### Employee Entity
- [ ] Create `src/domain/entities/employee.entity.ts`
- [ ] Add employee properties
- [ ] Add business logic methods
- [ ] Test entity

#### Employee Repository Interface
- [ ] Create `src/domain/repositories/employee-repository.interface.ts`
- [ ] Define findAll method
- [ ] Define findById method
- [ ] Define create method
- [ ] Define update method
- [ ] Define delete method

### 3.2 Application Layer

#### Employee DTOs
- [ ] Create `src/application/dtos/employee/employee.dto.ts`
- [ ] Create `src/application/dtos/employee/create-employee.dto.ts`
- [ ] Create `src/application/dtos/employee/update-employee.dto.ts`
- [ ] Create `src/application/dtos/employee/employee-query.dto.ts`
- [ ] Test DTOs

#### Employee Use Cases
- [ ] Create `src/application/use-cases/employee/get-employees-use-case.ts`
- [ ] Create `src/application/use-cases/employee/get-employee-by-id-use-case.ts`
- [ ] Create `src/application/use-cases/employee/create-employee-use-case.ts`
- [ ] Create `src/application/use-cases/employee/update-employee-use-case.ts`
- [ ] Create `src/application/use-cases/employee/delete-employee-use-case.ts`
- [ ] Test use cases

#### Employee Mapper
- [ ] Create `src/application/mappers/employee.mapper.ts`
- [ ] Implement toDTO methods
- [ ] Implement toEntity methods
- [ ] Test mapper

### 3.3 Infrastructure Layer

#### Employee Endpoints
- [ ] Create `src/infrastructure/http/endpoints/employee-endpoints.ts`
- [ ] Implement all CRUD endpoints
- [ ] Test endpoints

#### Employee Repository
- [ ] Create `src/infrastructure/repositories/http-employee-repository.ts`
- [ ] Implement IEmployeeRepository
- [ ] Test repository

### 3.4 Presentation Layer

#### Employee Store
- [ ] Create `src/presentation/stores/employee-store.ts`
- [ ] Add employees state
- [ ] Add selectedEmployee state
- [ ] Add loading/error states
- [ ] Add actions
- [ ] Test store

#### Employee Hooks
- [ ] Create `src/presentation/hooks/employee/use-employees.ts`
- [ ] Create `src/presentation/hooks/employee/use-employee.ts`
- [ ] Create `src/presentation/hooks/employee/use-create-employee.ts`
- [ ] Create `src/presentation/hooks/employee/use-update-employee.ts`
- [ ] Create `src/presentation/hooks/employee/use-delete-employee.ts`
- [ ] Test hooks

#### Employee Components
- [ ] Create `src/presentation/components/employee/employee-list.tsx`
- [ ] Create `src/presentation/components/employee/employee-table.tsx`
- [ ] Create `src/presentation/components/employee/employee-form.tsx`
- [ ] Create `src/presentation/components/employee/employee-details.tsx`
- [ ] Create `src/presentation/components/employee/employees-main.tsx`
- [ ] Test components

#### Employee Pages
- [ ] Create `src/app/(main)/employees/page.tsx`
- [ ] Create `src/app/(main)/employees/[id]/page.tsx`
- [ ] Create `src/app/(main)/employees/new/page.tsx`
- [ ] Test pages

### 3.5 Testing Employee Management

- [ ] Unit test all use cases
- [ ] Component test all components
- [ ] Integration test CRUD operations
- [ ] E2E test employee flow

---

## Phase 4: Organization Features (Week 3-4)

### 4.1 Ranks Management

#### Domain Layer
- [ ] Create Rank entity
- [ ] Create RankRepository interface

#### Application Layer
- [ ] Create rank DTOs
- [ ] Create rank use cases
- [ ] Create rank mapper

#### Infrastructure Layer
- [ ] Create rank endpoints
- [ ] Create rank repository

#### Presentation Layer
- [ ] Create rank store
- [ ] Create rank hooks
- [ ] Create rank components
- [ ] Create rank pages

#### Testing
- [ ] Test ranks feature

### 4.2 Posts Management

#### Domain Layer
- [ ] Create Post entity
- [ ] Create PostRepository interface

#### Application Layer
- [ ] Create post DTOs
- [ ] Create post use cases
- [ ] Create post mapper

#### Infrastructure Layer
- [ ] Create post endpoints
- [ ] Create post repository

#### Presentation Layer
- [ ] Create post store
- [ ] Create post hooks
- [ ] Create post components
- [ ] Create post pages

#### Testing
- [ ] Test posts feature

### 4.3 Employee Assignments

#### Application Layer
- [ ] Create assignment use cases
- [ ] Create assignment DTOs

#### Presentation Layer
- [ ] Create assignment components
- [ ] Integrate with employee and post modules

#### Testing
- [ ] Test assignments feature

---

## Phase 5: Attendance & Payroll (Week 4-5)

### 5.1 Attendance Management

#### Domain Layer
- [ ] Create Attendance entity
- [ ] Create AttendanceRepository interface

#### Application Layer
- [ ] Create attendance DTOs
- [ ] Create attendance use cases
- [ ] Create attendance mapper

#### Infrastructure Layer
- [ ] Create attendance endpoints
- [ ] Create attendance repository

#### Presentation Layer
- [ ] Create attendance store
- [ ] Create attendance hooks
- [ ] Create attendance components
- [ ] Create attendance pages

#### Testing
- [ ] Test attendance feature

### 5.2 Payroll Management

#### Domain Layer
- [ ] Create Payroll entity
- [ ] Create PayrollRepository interface

#### Application Layer
- [ ] Create payroll DTOs
- [ ] Create payroll use cases
- [ ] Implement payroll calculations
- [ ] Create payroll mapper

#### Infrastructure Layer
- [ ] Create payroll endpoints
- [ ] Create payroll repository

#### Presentation Layer
- [ ] Create payroll store
- [ ] Create payroll hooks
- [ ] Create payroll components
- [ ] Create payroll pages

#### Testing
- [ ] Test payroll feature

---

## Phase 6: Reports (Week 5-6)

### 6.1 Report Generation

#### Domain Layer
- [ ] Create Report entity
- [ ] Create ReportRepository interface

#### Application Layer
- [ ] Create report DTOs
- [ ] Create report use cases
- [ ] Create report mapper

#### Infrastructure Layer
- [ ] Create report endpoints
- [ ] Create report repository

#### Presentation Layer
- [ ] Create report store
- [ ] Create report hooks
- [ ] Create report components
- [ ] Create report pages

#### Testing
- [ ] Test report generation

### 6.2 Export Functionality

#### Infrastructure Layer
- [ ] Create PDF export service
- [ ] Create Excel export service

#### Presentation Layer
- [ ] Integrate export with reports
- [ ] Build export UI

#### Testing
- [ ] Test export functionality

---

## Phase 7: Polish & Optimization (Week 6-7)

### 7.1 Testing

#### Unit Tests
- [ ] Add unit tests for all use cases
- [ ] Add unit tests for domain entities
- [ ] Add unit tests for utilities
- [ ] Achieve 80%+ coverage

#### Component Tests
- [ ] Add tests for all components
- [ ] Test form validation
- [ ] Test user interactions

#### Integration Tests
- [ ] Add integration tests for API calls
- [ ] Add integration tests for repositories
- [ ] Test end-to-end flows

#### E2E Tests
- [ ] Add E2E tests for critical paths
- [ ] Test login flow
- [ ] Test employee CRUD
- [ ] Test report generation

### 7.2 Performance Optimization

- [ ] Analyze bundle size
- [ ] Implement code splitting
- [ ] Optimize images
- [ ] Add loading states
- [ ] Implement caching strategies
- [ ] Optimize API calls

### 7.3 Documentation

- [ ] Update README.md
- [ ] Document architecture
- [ ] Create developer guide
- [ ] Document API integration
- [ ] Add code comments
- [ ] Create migration guide

### 7.4 Cleanup

- [ ] Remove old Vite app
- [ ] Remove unused dependencies
- [ ] Clean up legacy code
- [ ] Update CI/CD pipelines
- [ ] Remove migration branch
- [ ] Merge to main

---

## Post-Migration

### Verification

- [ ] All features working
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No ESLint errors

### Deployment

- [ ] Update environment variables
- [ ] Update deployment scripts
- [ ] Test in staging
- [ ] Deploy to production
- [ ] Monitor for issues

### Team Training

- [ ] Conduct architecture training
- [ ] Share documentation
- [ ] Code review session
- [ ] Q&A session

---

## Notes

- Check off items as you complete them
- Add notes for any blockers or issues
- Update timeline if needed
- Communicate progress regularly

---

**Last Updated**: [Date]
**Status**: In Progress
