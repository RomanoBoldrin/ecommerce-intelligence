import React from 'react';
import { funnelData } from './dashboardData';

export default function ConversionFunnel() {
  return (
    <div className="xl:col-span-6 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Funil da Jornada de Compra
          </h2>
          <span className="px-space-sm py-0.5 rounded-full bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant">
            Etapas 1 a 5
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          Visualização de gargalos e taxas de abandono sequenciais entre etapas.
        </p>
        
        <div className="space-y-space-sm">
          {funnelData.map((stage, index) => (
            <div key={stage.id}>
              <div className="flex items-center justify-between text-label-md font-label-md text-on-surface mb-1">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${stage.color}`}></span>
                  {stage.title}
                </span>
                <span className={`font-semibold ${stage.valueColor || ''}`}>
                  {stage.value}
                  <span className="text-on-surface-variant font-normal ml-1">
                    {stage.percentage}
                  </span>
                </span>
              </div>
              <div className="w-full bg-surface-container-low h-7 rounded-lg overflow-hidden flex items-center px-space-sm">
                <div
                  className={`${stage.barColor} h-5 rounded flex items-center justify-between px-2 ${stage.textClass || 'text-on-surface'} font-label-sm text-label-sm ${stage.barWidth}`}
                >
                  <span className="truncate">{stage.label}</span>
                  <span>{stage.subvalue}</span>
                </div>
              </div>
              
              {stage.dropoff && (
                <div className="flex items-center gap-2 py-1 px-space-md">
                  <span className={`material-symbols-outlined text-[16px] ${
                    stage.dropoff.type === 'critical' 
                      ? 'text-error' 
                      : stage.dropoff.type === 'warning' 
                        ? 'text-on-secondary-container' 
                        : 'text-on-surface-variant'
                  }`}>
                    {stage.dropoff.icon}
                  </span>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${stage.dropoff.bgClass} ${stage.dropoff.textClass} font-label-sm text-label-sm`}>
                    <span>
                      {stage.dropoff.text.split(/(\d+,\d+%)/).map((part, i) => 
                        part.match(/\d+,\d+%/) ? <strong key={i}>{part}</strong> : part
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-space-md pt-space-sm bg-surface-container-low p-space-md rounded-lg flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-space-xs text-on-surface">
          <span className="material-symbols-outlined text-primary text-[20px]">pie_chart</span>
          <span className="font-label-md text-label-md font-semibold">
            Conversão Global do Funil: 2,79%
          </span>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          348 vendas de 12.450 visitas
        </span>
      </div>
    </div>
  );
}
