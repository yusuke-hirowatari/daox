/**
 * DAOXLogo — brand mark + wordmark
 *
 * DAOXMark  : icon-only (rounded-square + white D glyph)
 * DAOXLogo  : mark + "DAOX" wordmark side-by-side
 */

/** Geometric "D" mark on a black rounded-square background */
export function DAOXMark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {/* Background */}
      <rect width="24" height="24" rx="5" fill="#1a1a1a" />
      {/* White D glyph — vertical bar + semicircular bowl */}
      <path d="M7.5 6h4a6 6 0 0 1 0 12h-4V6z" fill="white" />
      {/* Inner cutout for optical weight */}
      <path d="M9.5 8.5h1.8a3.5 3.5 0 0 1 0 7H9.5v-7z" fill="#1a1a1a" />
    </svg>
  );
}

/** Logo: mark + "DAOX" wordmark */
export function DAOXLogo({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const textSize = Math.round(size * 0.58);
  return (
    <span
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
      style={{ lineHeight: 1 }}
    >
      <DAOXMark size={size} />
      <span
        style={{
          fontSize: textSize,
          fontWeight: 700,
          color: "#1a1a1a",
          letterSpacing: "-0.3px",
        }}
      >
        DAOX
      </span>
    </span>
  );
}
