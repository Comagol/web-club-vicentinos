import { useState, useEffect, useCallback } from 'react';
import { socioService, adminService } from '../services/api';
import { Socio } from '../types/models';

export interface TeamMember extends Socio {
  assignedTasksCount?: number;
  completedTodayCount?: number;
}

export const useTeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch team members (employees with jefe_area or empleado roles)
  const fetchTeamMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminService.getUsuarios({
        rol: ['empleado', 'jefe_area'],
      });
      const responseData = response.data?.data || response.data;
      const teamMembersData = Array.isArray(responseData) ? responseData : (responseData?.items || []);
      const teamMembers = (teamMembersData as Socio[]).map((member: Socio) => ({
        ...member,
        assignedTasksCount: 0,
        completedTodayCount: 0,
      }));
      setMembers(teamMembers);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Error fetching team members';
      setError(errorMsg);
      console.error('Error fetching team members:', err);
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get single member details
  const getMemberDetails = useCallback(async (memberId: string) => {
    try {
      const response = await socioService.getProfile(memberId);
      const member = (response.data?.data || response.data) as Socio;
      return member;
    } catch (err) {
      console.error('Error fetching member details:', err);
      throw err;
    }
  }, []);

  // Update member stats (called from parent with task data)
  const updateMemberStats = useCallback(
    (tasks: any[]) => {
      const today = new Date().toISOString().split('T')[0];
      const statsMap = new Map<string, { assigned: number; completed: number }
      >();

      tasks.forEach((task) => {
        const memberId = task.asignadoA;
        if (!statsMap.has(memberId)) {
          statsMap.set(memberId, { assigned: 0, completed: 0 });
        }

        const stats = statsMap.get(memberId)!;
        stats.assigned += 1;

        // Count completed tasks today
        if (
          task.estado === 'completado' &&
          new Date(task.createdAt).toISOString().split('T')[0] === today
        ) {
          stats.completed += 1;
        }
      });

      setMembers((prev) =>
        prev.map((member) => {
          const stats = statsMap.get(member.id);
          return {
            ...member,
            assignedTasksCount: stats?.assigned || 0,
            completedTodayCount: stats?.completed || 0,
          };
        }),
      );
    },
    [],
  );

  // Refresh team members
  const refresh = useCallback(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  return {
    members,
    isLoading,
    error,
    getMemberDetails,
    updateMemberStats,
    refresh,
  };
};
