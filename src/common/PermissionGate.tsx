import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Module, Action } from '../configs/permissions';

interface PermissionGateProps {
  module: Module;
  action: Action;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  action,
  children,
  fallback = null,
}) => {
  const { hasPermission } = usePermissions();
  return hasPermission(module, action) ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGate;
