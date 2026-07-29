import React from 'react';
import { TeamMember } from '../../hooks/useTeamMembers';

interface TeamMembersPanelProps {
  members: TeamMember[];
  selectedMemberId?: string;
  onSelectMember?: (memberId: string) => void;
  isLoading?: boolean;
}

export const TeamMembersPanel: React.FC<TeamMembersPanelProps> = ({
  members,
  selectedMemberId,
  onSelectMember,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Equipo</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Cargando equipo...</p>
        </div>
      ) : members.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">No hay miembros del equipo</p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => onSelectMember?.(member.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedMemberId === member.id
                  ? 'bg-navy text-white'
                  : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {member.nombre} {member.apellido}
                  </p>
                  <p className="text-xs opacity-75">
                    {member.email}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <div className="font-semibold">
                    {member.assignedTasksCount || 0} tareas
                  </div>
                  <div className="opacity-75">
                    {member.completedTodayCount || 0} completadas hoy
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
