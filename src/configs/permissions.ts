import { UserRole } from '../types/auth';

export type Module =
  | 'employee'
  | 'rank'
  | 'post'
  | 'attendance'
  | 'payroll'
  | 'invoice'
  | 'reports';

export type Action = 'view' | 'create' | 'edit' | 'delete' | 'upload';

export type RolePermissions = Record<Module, Action[]>;
export type PermissionMatrix = Record<UserRole, RolePermissions>;

const allActions: Action[] = ['view', 'create', 'edit', 'delete', 'upload'];
const viewOnly: Action[] = ['view'];

export const PERMISSION_MATRIX: PermissionMatrix = {
  Admin: {
    employee: allActions,
    rank: allActions,
    post: allActions,
    attendance: allActions,
    payroll: allActions,
    invoice: allActions,
    reports: viewOnly,
  },
  DevAdmin: {
    employee: allActions,
    rank: allActions,
    post: allActions,
    attendance: allActions,
    payroll: allActions,
    invoice: allActions,
    reports: viewOnly,
  },
  Recruitment: {
    employee: ['view', 'create', 'edit', 'upload'],
    rank: viewOnly,
    post: viewOnly,
    attendance: viewOnly,
    payroll: viewOnly,
    invoice: viewOnly,
    reports: viewOnly,
  },
  Sales: {
    employee: viewOnly,
    rank: ['view', 'create', 'edit'],
    post: ['view', 'create', 'edit', 'upload'],
    attendance: viewOnly,
    payroll: viewOnly,
    invoice: viewOnly,
    reports: viewOnly,
  },
  HR: {
    employee: viewOnly,
    rank: viewOnly,
    post: viewOnly,
    attendance: viewOnly,
    payroll: ['view', 'create', 'edit'],
    invoice: viewOnly,
    reports: viewOnly,
  },
  Accounts: {
    employee: viewOnly,
    rank: viewOnly,
    post: viewOnly,
    attendance: viewOnly,
    payroll: viewOnly,
    invoice: ['view', 'create', 'edit'],
    reports: viewOnly,
  },
  Operation: {
    employee: viewOnly,
    rank: viewOnly,
    post: viewOnly,
    attendance: ['view', 'create', 'edit'],
    payroll: viewOnly,
    invoice: viewOnly,
    reports: viewOnly,
  },
};

export function getPermissions(role: UserRole): RolePermissions {
  return PERMISSION_MATRIX[role] ?? PERMISSION_MATRIX['Accounts'];
}

export function checkPermission(
  role: UserRole,
  module: Module,
  action: Action
): boolean {
  const perms = getPermissions(role);
  return perms[module]?.includes(action) ?? false;
}
