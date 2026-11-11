import React from 'react';

export default function KpiCard({
  title,
  icon,
  iconColor,
  iconBg,
  value,
  trend,
  trendType,
  trendText,
  subtitle,
  isCritical
}) {
  const trendIcon = trendType === 'up' ? 'arrow_upward' : trendType === 'down' ? 'arrow_downward' : 'warning';
  
  return (
    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className={`font-label-sm text-label-sm uppercase tracking-wide ${isCritical ? 'text-error font-semibold' : 'text-on-surface-variant'}`}>
          {title}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <div className="my-space-sm">
        <div className={`font-metric-display text-metric-display ${isCritical ? 'text-error' : 'text-on-surface'} ${value.length > 7 ? 'text-[24px]' : ''}`}>
          {value}
        </div>
        <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
          isCritical 
            ? 'bg-error-container text-on-error-container'
            : 'bg-surface-container text-tertiary'
        }`}>
          <span className="material-symbols-outlined text-[14px]">{trendIcon}</span>
          {trend} {trendText}
        </div>
      </div>
      <p className={`font-body-sm text-body-sm ${isCritical ? 'text-error' : 'text-on-surface-variant'}`}>
        {subtitle}
      </p>
    </div>
  );
}
