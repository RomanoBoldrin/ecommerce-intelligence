'use client';

import React from 'react';
import { actionableInsightsData } from './dashboardData';

export default function ActionableInsights() {
  return (
    <div className="xl:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">lightbulb</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Decisões Recomendadas
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-primary font-semibold">
            {actionableInsightsData.length} Ações
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          Diagnósticos automáticos baseados nos desvios das métricas do seu funil.
        </p>
        
        <div className="space-y-space-md">
          {actionableInsightsData.map((insight) => (
            <div key={insight.id} className="bg-surface-container-low p-space-md rounded-lg relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${insight.color}`}></div>
              <div className={`flex items-center gap-1.5 ${insight.textColor} font-label-md text-label-md font-semibold mb-1`}>
                <span className="material-symbols-outlined text-[18px]">{insight.icon}</span>
                {insight.title}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface mb-2">
                {insight.description}
              </p>
              <div className="p-2 rounded bg-surface-container-lowest text-label-sm font-label-sm text-on-surface-variant mb-space-sm">
                <strong className="text-on-surface">Ação sugerida:</strong> {insight.action}
              </div>
              <button
                className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-space-sm rounded-lg font-label-md text-label-md transition-colors shadow-sm ${insight.buttonClass}`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">{insight.buttonIcon}</span>
                <span>{insight.buttonText}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-space-md pt-space-sm bg-surface-container-low p-space-md rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-headline-sm text-headline-sm font-bold">
            78
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-semibold text-on-surface">
              Saúde Geral da Loja
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Classificação: Bom (78/100)
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-tertiary text-[24px]">verified</span>
      </div>
    </div>
  );
}
