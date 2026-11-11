'use client';

import React from 'react';
import Link from 'next/link';
import { productData } from './dashboardData';

export default function ProductTable() {
  return (
    <div className="xl:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Desempenho por Produto & Categoria
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Acompanhe a eficácia de conversão e receita gerada por item.
            </p>
          </div>
          
          <div className="flex items-center gap-space-xs">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">
                search
              </span>
              <input
                className="pl-8 pr-3 py-1 text-label-sm font-label-sm rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none w-36 sm:w-48"
                placeholder="Buscar produto..."
                type="text"
              />
            </div>
            <button className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface text-label-sm font-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">filter_alt</span>
              <span className="hidden sm:inline">Filtrar</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-space-sm px-space-md rounded-l-lg">Produto</th>
                <th className="py-space-sm px-space-sm">Categoria</th>
                <th className="py-space-sm px-space-sm text-right">Visitas</th>
                <th className="py-space-sm px-space-sm text-right">Carrinhos</th>
                <th className="py-space-sm px-space-sm text-right">Pedidos</th>
                <th className="py-space-sm px-space-sm text-right">Conv.</th>
                <th className="py-space-sm px-space-sm text-right">Receita</th>
                <th className="py-space-sm px-space-md text-right rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
              {productData.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-space-sm px-space-md font-semibold text-on-surface flex items-center gap-space-xs">
                    <div className={`w-7 h-7 rounded bg-surface-container flex items-center justify-center shrink-0 ${product.iconColor}`}>
                      <span className="material-symbols-outlined text-[16px]">{product.icon}</span>
                    </div>
                    <span className="truncate max-w-[150px] sm:max-w-none">{product.name}</span>
                  </td>
                  <td className="py-space-sm px-space-sm">
                    <span className={`px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm ${product.categoryColor}`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="py-space-sm px-space-sm text-right font-medium">{product.visits}</td>
                  <td className="py-space-sm px-space-sm text-right text-on-surface-variant">{product.carts}</td>
                  <td className={`py-space-sm px-space-sm text-right font-semibold ${product.ordersColor || ''}`}>
                    {product.orders}
                  </td>
                  <td className={`py-space-sm px-space-sm text-right ${product.conversionColor ? 'font-semibold ' + product.conversionColor : 'text-on-surface-variant'}`}>
                    {product.conversion}
                  </td>
                  <td className={`py-space-sm px-space-sm text-right font-semibold ${product.revenueColor || ''}`}>
                    {product.revenue}
                  </td>
                  <td className="py-space-sm px-space-md text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${product.status.bgClass} ${product.status.textClass} font-label-sm text-label-sm`}>
                      <span className="material-symbols-outlined text-[13px]">{product.status.icon}</span>
                      {product.status.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-space-md pt-space-sm bg-surface-container-low p-space-md rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm text-label-md font-label-md">
        <div className="flex items-center gap-space-md flex-wrap text-on-surface">
          <span>
            Total consolidado: <strong className="font-semibold text-primary">R$ 52.200,00</strong>
          </span>
          <span className="text-on-surface-variant">|</span>
          <span>
            Pedidos: <strong className="font-semibold">348 transações</strong>
          </span>
        </div>
        <Link href="#" className="text-primary hover:text-on-primary-fixed-variant font-semibold flex items-center gap-1 transition-colors">
          <span>Ver catálogo completo (28 itens)</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
