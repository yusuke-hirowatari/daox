"use client";

import type { ReactNode } from "react";

// ─── StatCard ─────────────────────────────────────────────────────────────

type DeltaTone = "up" | "down" | "flat";

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "up",
  sub,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: DeltaTone;
  sub?: string;
}) {
  const deltaColor =
    deltaTone === "up"
      ? "#3e8056"
      : deltaTone === "down"
      ? "#6666ff"
      : "#9a9aa0";
  const arrow = deltaTone === "up" ? "↑" : deltaTone === "down" ? "↓" : "→";

  return (
    <div className="flex-1 min-w-0 px-4 py-3.5 border border-[#dedee5] rounded-[10px] bg-white">
      <div className="text-[11px] text-[#9a9aa0] font-mono tracking-[0.5px] uppercase">
        {label}
      </div>
      <div className="text-[24px] font-bold font-mono mt-1.5 tracking-[-0.5px]">
        {value}
      </div>
      {delta && (
        <div
          className="text-[10.5px] mt-1 font-semibold font-mono"
          style={{ color: deltaColor }}
        >
          {arrow} {delta}
          {sub && (
            <span className="text-[#9a9aa0] font-normal ml-1">{sub}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── AdminPill ───────────────────────────────────────────────────────────

export type PillTone = "default" | "open" | "success" | "warn" | "info" | "muted";

const PILL_TONES: Record<PillTone, { bg: string; fg: string }> = {
  default: { bg: "#e8e8f0", fg: "#525261" },
  open:    { bg: "#ebebff", fg: "#6666ff" },
  success: { bg: "#e2efe7", fg: "#3e8056" },
  warn:    { bg: "#fdf3d9", fg: "#937515" },
  info:    { bg: "#e3ecf3", fg: "#3a6a8e" },
  muted:   { bg: "#e8e8f0", fg: "#9a9aa0" },
};

export function AdminPill({
  tone = "default",
  children,
}: {
  tone?: PillTone;
  children: ReactNode;
}) {
  const t = PILL_TONES[tone];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap"
      style={{ background: t.bg, color: t.fg }}
    >
      {children}
    </span>
  );
}

// ─── AdminBtn ────────────────────────────────────────────────────────────

export type BtnVariant = "primary" | "outline" | "ghost" | "accent" | "danger";

const BTN_VARIANTS: Record<
  BtnVariant,
  { bg: string; fg: string; border: string; hoverBg: string }
> = {
  primary: { bg: "#1a1a1a", fg: "#fff",    border: "#1a1a1a", hoverBg: "#333" },
  outline: { bg: "#fff",    fg: "#1a1a1a", border: "#1a1a1a", hoverBg: "#f1f1f5" },
  ghost:   { bg: "transparent", fg: "#1a1a1a", border: "transparent", hoverBg: "#f1f1f5" },
  accent:  { bg: "#6666ff", fg: "#fff",    border: "#6666ff", hoverBg: "#5555ee" },
  danger:  { bg: "#fff",    fg: "#6666ff", border: "#6666ff", hoverBg: "#f5f5ff" },
};

export function AdminBtn({
  children,
  variant = "primary",
  icon,
  onClick,
  disabled,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const s = BTN_VARIANTS[variant];
  return (
    <button
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11.5px] font-semibold whitespace-nowrap border transition-colors disabled:opacity-40"
      style={{ background: s.bg, color: s.fg, borderColor: s.border }}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

// ─── AdminTable ──────────────────────────────────────────────────────────

export type ColDef = {
  key: string;
  label: string;
  flex?: number;
  w?: number;
  align?: "left" | "right" | "center";
  mono?: boolean;
  muted?: boolean;
  bold?: boolean;
};

export function AdminTable({
  cols,
  rows,
  rowHeight = 44,
}: {
  cols: ColDef[];
  rows: Record<string, ReactNode>[];
  rowHeight?: number;
}) {
  return (
    <div className="border border-[#dedee5] rounded-[10px] overflow-hidden bg-white">
      {/* Header */}
      <div
        className="flex px-3.5 bg-[#f1f1f5] border-b border-[#dedee5] text-[10.5px] text-[#9a9aa0] font-mono tracking-[0.5px] font-semibold items-center"
        style={{ height: 32 }}
      >
        {cols.map((c, i) => (
          <div
            key={i}
            className="pr-2 shrink-0"
            style={{
              flex: c.flex ?? 1,
              minWidth: c.w ?? 0,
              width: c.w,
              textAlign: c.align ?? "left",
            }}
          >
            {c.label}
          </div>
        ))}
      </div>
      {/* Rows */}
      {rows.map((r, ri) => (
        <div
          key={ri}
          className="flex px-3.5 items-center border-b last:border-b-0 border-[#dedee5] text-[12px]"
          style={{
            minHeight: rowHeight,
            background: ri % 2 === 1 ? "#f8f8fb" : "transparent",
          }}
        >
          {cols.map((c, ci) => (
            <div
              key={ci}
              className="pr-2 shrink-0"
              style={{
                flex: c.flex ?? 1,
                minWidth: c.w ?? 0,
                width: c.w,
                textAlign: c.align ?? "left",
                color: c.muted ? "#9a9aa0" : "#1a1a1a",
                fontFamily: c.mono ? "var(--font-hanken, monospace)" : undefined,
                fontWeight: c.bold ? 600 : 500,
              }}
            >
              {r[c.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── BarChart ────────────────────────────────────────────────────────────

export function BarChart({
  data,
  height = 120,
}: {
  data: { k: string; v: number; hi?: boolean }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.v), 1);
  return (
    <div className="flex items-end gap-0.5 relative" style={{ height }}>
      {[0.25, 0.5, 0.75, 1].map((p) => (
        <div
          key={p}
          className="absolute left-0 right-0 border-t border-[#dedee5] pointer-events-none"
          style={{ bottom: `${p * 100}%` }}
        />
      ))}
      {data.map((d, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center gap-1 relative z-10"
        >
          <div className="flex-1 flex items-end w-full">
            <div
              className="w-[70%] mx-auto rounded-[2px]"
              style={{
                height: `${Math.max((d.v / max) * 100, 2)}%`,
                background: d.hi ? "#6666ff" : "#1a1a1a",
              }}
            />
          </div>
          <div className="text-[9px] text-[#9a9aa0] font-mono">{d.k}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MiniSpark ────────────────────────────────────────────────────────────

export function MiniSpark({
  values,
  width = 100,
  height = 28,
  color = "#1a1a1a",
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  const max = Math.max(...values, 1);
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * width;
      const y = height - (v / max) * height;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── AdminPageShell ───────────────────────────────────────────────────────

export function AdminPageShell({
  breadcrumbs,
  title,
  sub,
  actions,
  children,
}: {
  breadcrumbs?: string;
  title: string;
  sub?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-none flex items-center gap-4 px-6 py-3.5 border-b border-[#dedee5]">
        <div className="flex-1 min-w-0">
          {breadcrumbs && (
            <div className="text-[10.5px] text-[#9a9aa0] font-mono mb-1">
              {breadcrumbs}
            </div>
          )}
          <div className="text-[17px] font-bold leading-tight">{title}</div>
          {sub && (
            <div className="text-[11px] text-[#9a9aa0] mt-0.5">{sub}</div>
          )}
        </div>
        {actions && (
          <div className="flex-none flex items-center gap-2">{actions}</div>
        )}
      </div>
      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-[#fafafa]">{children}</div>
    </div>
  );
}
