import React from 'react';

export type ActivityStatusFilter = 'all' | 'abierta' | 'cerrada' | 'cancelada';

interface ActivityFilterBarProps {
  selectedStatus: ActivityStatusFilter;
  onStatusChange: (status: ActivityStatusFilter) => void;
}

export const ActivityFilterBar: React.FC<ActivityFilterBarProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  const filters: { label: string; value: ActivityStatusFilter }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Abiertas', value: 'abierta' },
    { label: 'Cerradas', value: 'cerrada' },
    { label: 'Canceladas', value: 'cancelada' },
  ];

  return (
    <div className="bg-white rounded-card border-[0.5px] border-neutral-300 p-lg">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={`px-4 py-2 rounded-btn font-600 text-body transition-all ${
              selectedStatus === filter.value
                ? 'bg-navy-800 text-white'
                : 'bg-neutral-100 text-navy-800 hover:bg-neutral-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};
