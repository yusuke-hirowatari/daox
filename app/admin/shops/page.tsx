"use client";

import { Avatar } from "@/components/atoms/Avatar";
import { AdminBtn, AdminPageShell } from "@/components/admin/atoms";

// ─── FakeQR (module-level) ────────────────────────────────────────────────

function QrFinder({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} fill="#1a1a1a" />
      <rect x={x + 1} y={y + 1} width={s - 2} height={s - 2} fill="white" />
      <rect x={x + 2} y={y + 2} width={s - 4} height={s - 4} fill="#1a1a1a" />
    </g>
  );
}

function FakeQR({ size = 160 }: { size?: number }) {
  const cells = 21;
  const cell  = size / cells;
  const dots: [number, number][] = [];
  const finderZones = new Set<string>();
  [[0,0],[0,14],[14,0]].forEach(([fr,fc]) => {
    for (let r = fr; r < fr + 7; r++) for (let c = fc; c < fc + 7; c++) finderZones.add(`${r},${c}`);
  });
  let seed = 0x5a7f;
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if (finderZones.has(`${r},${c}`)) continue;
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      if ((seed >>> 0) % 3 < 2) dots.push([r, c]);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {dots.map(([r, c]) => (
        <rect key={`${r},${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1a1a1a" />
      ))}
      <QrFinder x={0}             y={0}             s={7 * cell} />
      <QrFinder x={0}             y={(cells - 7) * cell} s={7 * cell} />
      <QrFinder x={(cells - 7) * cell} y={0}         s={7 * cell} />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────

const CHECKIN_SETTINGS = [
  { k: "チェックイン報酬", v: "+10 DAO / 回" },
  { k: "XP",              v: "+10 XP / 回" },
  { k: "制限",            v: "1日1回まで"   },
  { k: "有効期間",        v: "無期限"       },
];

const DOWNLOAD_OPTIONS = ["A4 ポスター用 PDF", "A6 卓上版 PDF", "透明背景 PNG"];

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminShopsPage() {
  return (
    <AdminPageShell
      breadcrumbs="HOME › 店舗 › 新規"
      title="店舗を登録"
      actions={
        <>
          <AdminBtn variant="ghost">下書き保存</AdminBtn>
          <AdminBtn>登録してQRを発行</AdminBtn>
        </>
      }
    >
      <div className="flex overflow-hidden" style={{ minHeight: "calc(100vh - 120px)" }}>

        {/* Left: form */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-[640px]">

            {/* Shop name */}
            <div className="mb-3.5">
              <div className="text-[11.5px] font-semibold mb-1.5">
                店舗名 <span className="text-[#6666ff]">*</span>
              </div>
              <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center text-[12.5px] bg-white">
                新富カフェ ことり
              </div>
            </div>

            {/* 2-col grid */}
            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
              <div>
                <div className="text-[11.5px] font-semibold mb-1.5">
                  カテゴリ <span className="text-[#6666ff]">*</span>
                </div>
                <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center justify-between text-[12.5px] bg-white">
                  <span>飲食 / カフェ</span>
                  <span className="text-[#9a9aa0]">▾</span>
                </div>
              </div>
              <div>
                <div className="text-[11.5px] font-semibold mb-1.5">営業時間</div>
                <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center text-[12.5px] bg-white">
                  8:00–19:00 (火曜定休)
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-3.5">
              <div className="text-[11.5px] font-semibold mb-1.5">
                住所 <span className="text-[#6666ff]">*</span>
              </div>
              <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center text-[12.5px] bg-white">
                東京都中央区新富町2-3-5
              </div>
            </div>

            {/* 2-col grid */}
            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
              <div>
                <div className="text-[11.5px] font-semibold mb-1.5">代表者</div>
                <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center text-[12.5px] bg-white">
                  伊藤 さくら
                </div>
              </div>
              <div>
                <div className="text-[11.5px] font-semibold mb-1.5">
                  連絡先メール <span className="text-[#6666ff]">*</span>
                </div>
                <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center text-[12.5px] font-mono bg-white">
                  kotori@example.com
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <div className="text-[11.5px] font-semibold mb-0.5">紹介文 (任意)</div>
              <div className="text-[10.5px] text-[#9a9aa0] mb-1.5">
                お知らせや掲示板で参照される説明文
              </div>
              <div className="min-h-[60px] p-2.5 border border-[#dedee5] rounded-md text-[11.5px] text-[#525261] leading-[1.5] bg-white">
                こだわりのスペシャルティコーヒーと自家製スイーツのお店。Wi-Fi完備。
              </div>
            </div>

            {/* Checkin settings */}
            <div className="text-[12px] font-bold text-[#525261] mt-4 mb-2.5">
              チェックイン設定
            </div>
            <div className="border border-[#dedee5] rounded-lg overflow-hidden mb-4">
              {CHECKIN_SETTINGS.map(({ k, v }) => (
                <div
                  key={k}
                  className="flex items-center px-3.5 py-2 border-b border-[#dedee5] last:border-b-0 text-[11.5px]"
                >
                  <span className="w-[130px] text-[#9a9aa0] flex-none">{k}</span>
                  <span className={`flex-1 font-semibold ${k.includes("報酬") ? "font-mono" : ""}`}>
                    {v}
                  </span>
                  <span className="text-[10px] text-[#6666ff] font-semibold cursor-pointer">
                    変更
                  </span>
                </div>
              ))}
            </div>

            {/* Owner */}
            <div className="text-[12px] font-bold text-[#525261] mb-2.5">
              オーナー (店舗管理者)
            </div>
            <div className="flex items-center gap-3 p-3 border border-[#dedee5] rounded-lg bg-[#f1f1f5]">
              <Avatar size={32} label="伊" tone={1} />
              <div className="flex-1">
                <div className="text-[12px] font-semibold">伊藤 さくら</div>
                <div className="text-[10.5px] text-[#9a9aa0] font-mono">@sakura.ito</div>
              </div>
              <span className="text-[10.5px] text-[#6666ff] font-semibold cursor-pointer">
                変更
              </span>
            </div>
            <div className="text-[10.5px] text-[#9a9aa0] mt-1.5 leading-[1.5]">
              店舗オーナーは「運営者ビュー」で店舗QR表示・チェックイン状況確認・クーポン発行が可能
            </div>
          </div>
        </div>

        {/* Right: QR preview */}
        <div
          className="flex-none border-l border-[#dedee5] bg-[#f1f1f5] p-6 overflow-y-auto"
          style={{ width: 340 }}
        >
          <div className="text-[12px] font-bold mb-3">QRプレビュー</div>

          <div className="p-3.5 bg-white border border-[#dedee5] rounded-[10px] mb-3.5">
            <div className="text-[11.5px] font-bold mb-0.5">新富カフェ ことり</div>
            <div className="text-[10px] text-[#9a9aa0] mb-3">+10 DAO / チェックイン</div>
            <div className="flex justify-center py-1">
              <FakeQR size={160} />
            </div>
            <div className="text-[9.5px] text-[#9a9aa0] font-mono text-center mt-2">
              shop_kotori_a4f9c2
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            {DOWNLOAD_OPTIONS.map((d) => (
              <div
                key={d}
                className="flex items-center gap-2 px-3 py-2 border border-[#dedee5] rounded-md bg-white text-[11px] cursor-pointer hover:border-[#9a9aa0]"
              >
                <span className="flex-1">{d}</span>
                <span className="text-[10px] text-[#6666ff] font-semibold">↓</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border border-[#dedee5] rounded-lg text-[10.5px] text-[#525261] leading-[1.5]">
            ⓘ QRコードは保存後に確定します。期限切れ防止のため{" "}
            <strong>180日ごとに自動更新</strong>。
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
