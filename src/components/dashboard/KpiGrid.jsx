import React from 'react';
import KpiCard from './KpiCard';
import { kpiData } from './dashboardData';

export default function KpiGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
      {kpiData.map((kpi) => (
        <KpiCard key={kpi.id} {...kpi} />
      ))}
    </div>
  );
}
