interface DividerProps {
  /** 上下マージン (px) */
  my?: number;
  className?: string;
}

export function Divider({ my = 0, className = "" }: DividerProps) {
  return (
    <div
      className={`h-px shrink-0 bg-[#dedee5] ${className}`}
      style={my ? { marginTop: my, marginBottom: my } : undefined}
    />
  );
}
