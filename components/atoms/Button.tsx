import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "accent" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** 100% 幅 */
  full?: boolean;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary: "bg-[#1a1a1a] text-white border-[#1a1a1a] hover:bg-[#333333]",
  ghost:   "bg-transparent text-[#1a1a1a] border-[#dedee5] hover:bg-[#f1f1f5]",
  accent:  "bg-[#6666ff] text-white border-[#6666ff] hover:bg-[#4d4dff]",
  outline: "bg-transparent text-[#1a1a1a] border-[#1a1a1a] hover:bg-[#f1f1f5]",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "text-[11px] px-4 py-2",
  md: "text-[12px] px-5 py-3",
  lg: "text-[13px] px-6 py-3.5",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  full = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        // ─── 必ず守るルール ───
        // ラベルの改行防止: white-space: nowrap
        // flex-shrink は既定 (=1) のまま — SP ボトムバーで縮小吸収
        "inline-flex items-center justify-center gap-1.5",
        "rounded-[999px] border font-semibold",
        "whitespace-nowrap",        // ← 改行禁止
        "transition-colors",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        full ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
