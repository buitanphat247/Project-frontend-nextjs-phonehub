import { useState, useEffect } from 'react';
import { getAllRoles } from '../../../../../lib/api/roles';
import type { RoleResponse } from '../../../../../lib/api/roles';

export interface RoleOption {
  id: number;
  name: string;
}

// Event emitter để notify khi role thay đổi
const ROLE_CHANGED_EVENT = 'roles-changed';

export function notifyRoleChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ROLE_CHANGED_EVENT));
  }
}

export function useRolesForSelect(shouldFetch: boolean = false) {
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await getAllRoles();
      if (response.success && response.data) {
        const roleOptions: RoleOption[] = response.data.map((role: RoleResponse) => ({
          id: role.id,
          name: role.name,
        }));
        setRoles(roleOptions);
      }
    } catch (error: any) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch when shouldFetch is true
    if (shouldFetch) {
      fetchRoles();
    }

    // Listen for role changes
    const handleRoleChange = () => {
      if (shouldFetch) {
        fetchRoles();
      }
    };

    window.addEventListener(ROLE_CHANGED_EVENT, handleRoleChange);
    return () => window.removeEventListener(ROLE_CHANGED_EVENT, handleRoleChange);
  }, [shouldFetch]);

  return { roles, loading, refetch: fetchRoles };
}

