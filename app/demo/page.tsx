/**
 * /demo — 全アトムコンポーネント確認ページ
 * npm run dev 起動後 http://localhost:3000/demo で確認できます
 */

import {
  Avatar,
  Button,
  StatusPill,
  Chip,
  Divider,
  Input,
  TopBar,
  PcHeader,
  BackButton,
  TopTabs,
  PillTabs,
  SegmentedTabs,
  AnnouncementBar,
} from "@/components/atoms";
import { NOVA, NEBULA, STATUS_STYLES } from "@/lib/tokens";
import type { StatusVariant } from "@/lib/tokens";

const DEMO_ANNOUNCEMENTS = [
  { title: "皆さん、お疲れ様です！", author: "運営事務局 @ 新富町" },
  { title: "5月23日(金) 市役所窓口の臨時休業について", author: "運営事務局 @ 新富町" },
  { title: "夏祭り 出店者募集のお知らせ — 締切 6/30", author: "運営事務局 @ 新富町" },
];

export default function DemoPage() {
  const statuses = Object.keys(STATUS_STYLES) as StatusVariant[];

  return (
    <div className="min-h-screen bg-[#f1f1f5] p-8 font-sans">
      <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-8">DAOX — コンポーネントデモ</h1>

      {/* ─── Colors ─────────────────────────────────────── */}
      <Section title="カラーパレット">
        <div className="space-y-3">
          <Label>Nova Blue</Label>
          <div className="flex gap-2 flex-wrap">
            {(Object.entries(NOVA) as [string, string][]).map(([k, v]) => (
              <ColorSwatch key={k} color={v} label={`${k}\n${v}`} />
            ))}
          </div>
          <Label>Nebula Gray</Label>
          <div className="flex gap-2 flex-wrap">
            {(Object.entries(NEBULA) as [string, string][]).map(([k, v]) => (
              <ColorSwatch key={k} color={v} label={`${k}\n${v}`} />
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Avatar ──────────────────────────────────────── */}
      <Section title="Avatar">
        <div className="flex gap-3 items-end flex-wrap">
          {[16, 24, 32, 40, 48, 56].map((s) => (
            <Avatar key={s} size={s} label="田" tone={0} />
          ))}
          {[0, 1, 2, 3, 4].map((t) => (
            <Avatar key={t} size={36} label="山" tone={t} />
          ))}
        </div>
      </Section>

      {/* ─── Button ──────────────────────────────────────── */}
      <Section title="Button">
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap items-center">
            <Button variant="primary">主要CTA</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="accent">Accent (Nova Blue)</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="max-w-xs">
            <Button full>Full Width Button</Button>
          </div>
          <div className="flex gap-2 max-w-sm">
            <p className="text-[11px] text-[#9a9aa0] mt-1">SP ボトムアクションバー — CTA は縮小で収まる:</p>
          </div>
          <div className="flex gap-2 max-w-[260px]">
            <Button variant="ghost">キャンセル</Button>
            <Button variant="primary">承認 (500 DAO 支払)</Button>
          </div>
        </div>
      </Section>

      {/* ─── StatusPill ──────────────────────────────────── */}
      <Section title="StatusPill">
        <div className="flex gap-2 flex-wrap">
          {statuses.filter((s) => s !== "default").map((s) => (
            <StatusPill key={s} status={s} />
          ))}
        </div>
      </Section>

      {/* ─── Chip ────────────────────────────────────────── */}
      <Section title="Chip">
        <div className="flex gap-2 flex-wrap">
          <Chip active>掃除・清掃</Chip>
          <Chip>運搬</Chip>
          <Chip>配達</Chip>
          <Chip active>イベント設営</Chip>
          <Chip>調理補助</Chip>
        </div>
      </Section>

      {/* ─── Input ───────────────────────────────────────── */}
      <Section title="Input">
        <div className="space-y-2 max-w-xs">
          <Input placeholder="キーワードで検索" />
          <Input
            placeholder="メールアドレスを入力"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
            }
          />
        </div>
      </Section>

      {/* ─── Divider ─────────────────────────────────────── */}
      <Section title="Divider">
        <div className="space-y-3">
          <Divider />
          <p className="text-[12px] text-[#9a9aa0]">セクション区切り</p>
          <Divider my={8} />
        </div>
      </Section>

      {/* ─── TopBar ──────────────────────────────────────── */}
      <Section title="TopBar / PcHeader">
        <div className="space-y-2 max-w-sm bg-white rounded-2xl overflow-hidden border border-[#dedee5]">
          <TopBar
            title="タスク一覧"
            left={<BackButton />}
            right={
              <>
                <Button size="sm" variant="ghost">フィルター</Button>
                <Button size="sm">+ 作成</Button>
              </>
            }
          />
          <div className="p-3 text-[11px] text-[#9a9aa0]">
            ← 右ボタンクラスタは flex-none で縮小禁止、タイトル側が省略される
          </div>
        </div>
        <div className="mt-2 max-w-lg bg-white rounded-2xl overflow-hidden border border-[#dedee5]">
          <PcHeader
            title="大変長いタイトル — 横幅が狭いときはタイトルが省略されます"
            right={
              <>
                <Button size="sm" variant="ghost">エクスポート</Button>
                <Button size="sm">新規作成</Button>
              </>
            }
          />
        </div>
      </Section>

      {/* ─── Tabs ────────────────────────────────────────── */}
      <Section title="Tabs">
        <div className="space-y-4 max-w-xs bg-white rounded-2xl overflow-hidden border border-[#dedee5] p-0">
          <TopTabs tabs={["お知らせ", "掲示板", "投票"]} />
          <PillTabs tabs={["使える", "使用済み・期限切れ"]} />
          <SegmentedTabs tabs={["募集中", "マイタスク"]} />
        </div>
      </Section>

      {/* ─── AnnouncementBar ─────────────────────────────── */}
      <Section title="AnnouncementBar">
        <div className="relative max-w-xs bg-white rounded-2xl overflow-visible border border-[#dedee5] pb-2 pt-2">
          <p className="px-3 text-[11px] text-[#9a9aa0] mb-1">（折りたたみ → タップで展開、「今後は表示しない」でlocalStorage保存）</p>
          <AnnouncementBar items={DEMO_ANNOUNCEMENTS} />
        </div>
      </Section>
    </div>
  );
}

/* ── helpers ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-[13px] font-semibold text-[#525261] uppercase tracking-widest mb-4">{title}</h2>
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,.08)]">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold text-[#9a9aa0] uppercase tracking-wider mb-1">{children}</p>;
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-10 h-10 rounded-lg border border-[#dedee5]" style={{ background: color }} />
      <span className="text-[9px] text-[#9a9aa0] text-center whitespace-pre-line leading-tight">{label}</span>
    </div>
  );
}
