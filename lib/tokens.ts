/** DAOX design tokens — TypeScript 版 (CSS変数と同期) */

export const NOVA = {
  100: '#f2f2ff', 200: '#e5e5ff', 300: '#ccccff', 400: '#b2b2ff',
  500: '#9999ff', 600: '#6666ff', 700: '#4d4dff', 800: '#1a1aff', 900: '#0000ff',
} as const;

export const NEBULA = {
  100: '#f1f1f5', 200: '#dedee5', 300: '#bbbbc0', 400: '#9a9aa0',
  500: '#75758a', 600: '#525261', 700: '#3f3f39', 800: '#23232a', 900: '#1a1a1f',
} as const;

export const colors = {
  bg:           '#ffffff',
  surface:      NEBULA[100],
  surface2:     NEBULA[200],
  line:         NEBULA[200],
  line2:        NEBULA[300],
  text:         '#1a1a1a',
  text2:        NEBULA[600],
  muted:        NEBULA[400],
  accent:       NOVA[600],
  accentSoft:   NOVA[100],
  accentStrong: NOVA[800],
} as const;

export type StatusVariant = 'open' | 'pending' | 'paid' | 'unpaid' | 'continue' | 'accepted' | 'done' | 'default';

export const STATUS_STYLES: Record<StatusVariant, { bg: string; fg: string; label: string }> = {
  open:     { bg: NOVA[100],    fg: NOVA[700],    label: '募集中'   },
  accepted: { bg: NOVA[200],    fg: NOVA[600],    label: '受注中'   }, // Nova Blue — active engagement
  pending:  { bg: '#fff8e0',    fg: '#9a6000',    label: '承認待ち' }, // Amber — requires action
  paid:     { bg: '#e4f3eb',    fg: '#2d7a4a',    label: '入金済み' }, // Green — success
  unpaid:   { bg: NEBULA[200],  fg: NEBULA[600],  label: '0で承認'  },
  continue: { bg: NEBULA[100],  fg: NEBULA[600],  label: '継続'     },
  done:     { bg: NEBULA[200],  fg: NEBULA[600],  label: '実施済み' },
  default:  { bg: NEBULA[200],  fg: NEBULA[600],  label: ''         },
};

export const radius = {
  card:  24,
  btn:   999,
  input: 16,
  sm:    12,
  xs:    8,
} as const;

export const shadows = {
  1: '0 2px 8px rgba(0,0,0,.08)',
  2: '0 4px 16px rgba(0,0,0,.12)',
  3: '0 8px 32px rgba(0,0,0,.16)',
} as const;

export const fontFamily =
  '"Hanken Grotesk", "Noto Sans JP", "Helvetica Neue", "Segoe UI", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';
