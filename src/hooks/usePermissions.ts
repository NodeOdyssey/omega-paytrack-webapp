import { useMemo } from 'react';
import { UserRole } from '../types/auth';
import {
  PERMISSION_MATRIX,
  Module,
  Action,
} from '../configs/permissions';

export function usePermissions() {
  const role =
    (localStorage.getItem('userRole') as UserRole) || 'Accounts';

  const permissions = useMemo(
    () => PERMISSION_MATRIX[role] ?? PERMISSION_MATRIX['Accounts'],
    [role]
  );

  const hasPermission = (module: Module, action: Action): boolean => {
    return permissions[module]?.includes(action) ?? false;
  };

  const canView = (module: Module) => hasPermission(module, 'view');
  const canCreate = (module: Module) => hasPermission(module, 'create');
  const canEdit = (module: Module) => hasPermission(module, 'edit');
  const canDelete = (module: Module) => hasPermission(module, 'delete');
  const canUpload = (module: Module) => hasPermission(module, 'upload');

  const isDevAdmin = role === 'DevAdmin';

  return {
    role,
    permissions,
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canUpload,
    isDevAdmin,
  };
}
