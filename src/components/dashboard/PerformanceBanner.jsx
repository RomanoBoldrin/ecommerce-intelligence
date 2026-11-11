'use client';

import React from 'react';

export default function PerformanceBanner() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
      <div className="flex flex-col">
        <div className="flex items-center gap-space-sm flex-wrap">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Resumo de Desempenho - Setembro 2026
          </h1>
          <div className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-low text-tertiary font-label-sm text-label-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            Atualizado há 12 min
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Monitore gargalos na jornada de compra e tome decisões orientadas a dados sem complicação.
        </p>
      </div>
      <div className="flex items-center gap-space-sm flex-wrap shrink-0">
        <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface">
          <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
          <span>Últimos 30 Dias</span>
        </div>
        <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface">
          <span className="material-symbols-outlined text-[16px] text-secondary">filter_list</span>
          <span>Todas as Categorias</span>
        </div>
        <button
          className="flex items-center gap-1 px-space-sm py-space-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span className="hidden sm:inline">Exportar CSV</span>
        </button>
      </div>
    </div>
  );
}
