"use client";

import { useState } from "react";
import { AdminBtn, AdminPageShell } from "@/components/admin/atoms";

// ─── Settings nav ─────────────────────────────────────────────────────────

const SETTINGS_TABS = [
  { id: "profile",  label: "プロフィール"  },
  { id: "official", label: "公式アカウント" },
  { id: "rules",    label: "ガイドライン"  },
  { id: "notif",    label: "通知設定"      },
  { id: "invite",   label: "招待・参加条件" },
  { id: "brand",    label: "ブランディング" },
  { id: "billing",  label: "請求・プラン"  },
  { id: "danger",   label: "危険な操作"    },
] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number]["id"];

// ─── Form atoms (module-level) ────────────────────────────────────────────

function Field({
  label,
  sub,
  children,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-[18px]">
      <div className="text-[11.5px] font-semibold text-[#1a1a1a] mb-1">{label}</div>
      {sub && (
        <div className="text-[10.5px] text-[#9a9aa0] mb-1.5">{sub}</div>
      )}
      {children}
    </div>
  );
}

function FieldInput({
  value,
  prefix,
  mono,
}: {
  value: string;
  prefix?: string;
  mono?: boolean;
}) {
  return (
    <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center bg-white text-[12.5px]">
      {prefix && (
        <span className="text-[#9a9aa0] font-mono mr-1">{prefix}</span>
      )}
      <span className={mono ? "font-mono" : ""}>{value}</span>
    </div>
  );
}

function FieldTextarea({ value }: { value: string }) {
  return (
    <div className="min-h-[72px] border border-[#dedee5] rounded-md px-3 py-2.5 bg-white text-[12.5px] leading-[1.55] text-[#1a1a1a]">
      {value}
    </div>
  );
}

function FieldSelect({ value }: { value: string }) {
  return (
    <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center justify-between bg-white text-[12.5px]">
      <span>{value}</span>
      <span className="text-[#9a9aa0]">▾</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <AdminPageShell
      breadcrumbs="HOME › コミュニティ設定"
      title="コミュニティ設定"
      sub="新富商店街コミュニティ"
      actions={
        <>
          <AdminBtn variant="outline">変更を破棄</AdminBtn>
          <AdminBtn>保存</AdminBtn>
        </>
      }
    >
      <div className="flex overflow-hidden" style={{ minHeight: "calc(100vh - 120px)" }}>

        {/* Settings nav */}
        <div
          className="flex-none border-r border-[#dedee5] bg-[#f1f1f5] p-3.5"
          style={{ width: 200 }}
        >
          {SETTINGS_TABS.map((t) => (
            <button
              key={t.id}
              className={[
                "w-full text-left px-2.5 py-[7px] rounded-md text-[12px] mb-0.5 border transition-colors",
                activeTab === t.id
                  ? "bg-white text-[#1a1a1a] font-semibold border-[#dedee5]"
                  : "bg-transparent text-[#525261] font-medium border-transparent hover:bg-white/60",
              ].join(" ")}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "profile" && (
            <div className="max-w-[560px]">
              <div className="text-[15px] font-bold mb-4">プロフィール</div>

              {/* Logo */}
              <Field label="ロゴ画像" sub="正方形 256×256px 以上推奨">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-xl text-white text-[28px] font-bold flex-none"
                    style={{ width: 64, height: 64, background: "#1a1a1a" }}
                  >
                    新
                  </div>
                  <AdminBtn variant="outline">画像を変更</AdminBtn>
                  <AdminBtn variant="ghost">削除</AdminBtn>
                </div>
              </Field>

              <Field label="コミュニティ名">
                <FieldInput value="新富商店街コミュニティ" />
              </Field>

              <Field label="DAOX URL">
                <FieldInput value="shintomi.daox.app" prefix="https://" mono />
              </Field>

              <Field
                label="概要"
                sub="メンバー登録画面とプロフィールに表示されます"
              >
                <FieldTextarea value="新富町商店街を中心とした地域コミュニティ。お仕事・物々交換・イベントを通じて地域を盛り上げます。" />
              </Field>

              <Field label="主な活動地域">
                <FieldInput value="千葉県中央区 新富町" />
              </Field>

              <Field label="言語">
                <FieldSelect value="日本語" />
              </Field>
            </div>
          )}

          {activeTab !== "profile" && (
            <div className="flex flex-col items-center justify-center py-20 text-[#9a9aa0]">
              <div className="text-[32px] mb-3">⚙</div>
              <div className="text-[13px]">
                {SETTINGS_TABS.find((t) => t.id === activeTab)?.label} の設定
              </div>
              <div className="text-[11px] mt-1">このセクションは準備中です</div>
            </div>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}
