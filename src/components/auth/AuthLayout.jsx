import React from "react";
import Link from "next/link";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <span className="font-bold text-2xl tracking-tight text-on-surface">
            Merchant Pulse
          </span>
        </Link>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Painel de Decisão E-Commerce
        </p>

        {title && (
          <h1 className="mt-6 text-xl font-bold tracking-tight text-on-surface sm:text-2xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
        )}
      </div>

      {/* Auth Card Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest py-8 px-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-outline-variant/40 rounded-xl sm:px-10">
          {children}
        </div>

        {/* Academic / Provenance Footer */}
        <div className="mt-8 text-center text-xs text-on-surface-variant/80 space-y-1">
          <p>UNIVESP — Projeto Integrador em Computação IV</p>
          <p className="text-[11px] text-on-surface-variant/60">
            Ambiente restrito. Não há cadastro público de consumidores.
          </p>
        </div>
      </div>
    </div>
  );
}

