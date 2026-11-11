import React from 'react';

export default function TemporalTrendChart() {
  return (
    <div className="xl:col-span-6 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-1">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Evolução Diária de Tráfego vs. Pedidos
          </h2>
          <div className="flex items-center gap-space-sm text-label-sm font-label-sm">
            <span className="inline-flex items-center gap-1 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Visitas (Eixo Esq.)
            </span>
            <span className="inline-flex items-center gap-1 text-tertiary">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              Pedidos (Eixo Dir.)
            </span>
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          Média de 415 visitas/dia (picos de até 620 aos finais de semana) e 11 a 18 pedidos/dia.
        </p>
        
        <div className="relative w-full h-[260px] bg-surface-container-low/40 rounded-lg p-space-sm flex flex-col justify-between">
          <div className="absolute top-4 right-1/4 bg-inverse-surface text-inverse-on-surface px-space-sm py-1 rounded-md shadow-md text-label-sm font-label-sm pointer-events-none z-10 hidden sm:block">
            <div className="font-semibold text-tertiary-fixed">
              Dia 20/09 (Domingo)
            </div>
            <div>Visitas: 618 | Pedidos: 19 (R$ 2.850)</div>
          </div>
          
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 540 200"
          >
            <defs>
              <linearGradient id="trafficGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25"></stop>
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>
            <line stroke="#dae2fd" strokeDasharray="3 3" x1="0" x2="540" y1="30" y2="30"></line>
            <line stroke="#dae2fd" strokeDasharray="3 3" x1="0" x2="540" y1="80" y2="80"></line>
            <line stroke="#dae2fd" strokeDasharray="3 3" x1="0" x2="540" y1="130" y2="130"></line>
            <line stroke="#dae2fd" x1="0" x2="540" y1="180" y2="180"></line>
            
            <rect fill="#4f46e5" fillOpacity="0.04" height="170" rx="4" width="36" x="90" y="10"></rect>
            <rect fill="#4f46e5" fillOpacity="0.04" height="170" rx="4" width="36" x="216" y="10"></rect>
            <rect fill="#4f46e5" fillOpacity="0.04" height="170" rx="4" width="36" x="342" y="10"></rect>
            <rect fill="#4f46e5" fillOpacity="0.04" height="170" rx="4" width="36" x="468" y="10"></rect>
            
            <path
              d="M 0,140 Q 45,135 90,130 C 105,70 120,60 126,60 C 135,110 170,125 216,130 C 228,65 245,55 252,58 C 270,115 300,125 342,128 C 355,50 372,40 378,42 C 390,110 430,120 468,125 C 480,55 498,48 504,50 L 540,115 L 540,180 L 0,180 Z"
              fill="url(#trafficGradient)"
            ></path>
            
            <path
              d="M 0,140 Q 45,135 90,130 C 105,70 120,60 126,60 C 135,110 170,125 216,130 C 228,65 245,55 252,58 C 270,115 300,125 342,128 C 355,50 372,40 378,42 C 390,110 430,120 468,125 C 480,55 498,48 504,50 L 540,115"
              fill="none"
              stroke="#4f46e5"
              strokeLinecap="round"
              strokeWidth="2.5"
            ></path>
            
            <path
              d="M 0,165 Q 45,160 90,158 C 105,120 120,112 126,115 C 135,150 170,155 216,158 C 228,118 245,110 252,112 C 270,152 300,155 342,156 C 355,105 372,98 378,100 C 390,148 430,152 468,154 C 480,108 498,102 504,105 L 540,150"
              fill="none"
              stroke="#006e4b"
              strokeLinecap="round"
              strokeWidth="2"
            ></path>
            
            <circle cx="126" cy="60" fill="#4f46e5" r="4"></circle>
            <circle cx="252" cy="58" fill="#4f46e5" r="4"></circle>
            <circle cx="378" cy="42" fill="#4f46e5" r="5" stroke="#ffffff" strokeWidth="2"></circle>
            <circle cx="504" cy="50" fill="#4f46e5" r="4"></circle>
            <circle cx="126" cy="115" fill="#006e4b" r="3.5"></circle>
            <circle cx="252" cy="112" fill="#006e4b" r="3.5"></circle>
            <circle cx="378" cy="100" fill="#006e4b" r="4" stroke="#ffffff" strokeWidth="2"></circle>
            <circle cx="504" cy="105" fill="#006e4b" r="3.5"></circle>
          </svg>
          
          <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm pt-2">
            <span>01 Set</span>
            <span>07 Set (Dom)</span>
            <span>14 Set (Dom)</span>
            <span>21 Set (Dom)</span>
            <span>28 Set (Dom)</span>
            <span>30 Set</span>
          </div>
        </div>
      </div>
      
      <div className="mt-space-md pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-tertiary">bolt</span>
          Picos de fim de semana geram até 620 visitas e 19 pedidos.
        </span>
        <span className="font-medium text-on-surface">Taxa de conversão oscila de 2,4% a 3,2%</span>
      </div>
    </div>
  );
}
