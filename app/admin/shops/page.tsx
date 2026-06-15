"use client";

import { useState } from "react";
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
  const [shopName, setShopName] = useState("新富カフェ ことり");
  const [category, setCategory] = useState("飲食 / カフェ");
  const [hours, setHours] = useState("8:00–19:00 (火曜定休)");
  const [address, setAddress] = useState("東京都中央区新富町2-3-5");
  const [representative, setRepresentative] = useState("伊藤 さくら");
  const [email, setEmail] = useState("kotori@example.com");
  const [bio, setBio] = useState("こだわりのスペシャルティコーヒーと自家製スイーツのお店。Wi-Fi完備。");

  // Draft / register states
  const [draftSaved, setDraftSaved] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Shop image state
  const [shopImage, setShopImage] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // QR fullscreen modal
  const [showQr, setShowQr] = useState(false);

  // Setting save feedback
  const [savedSetting, setSavedSetting] = useState<string | null>(null);

  // Checkin settings state
  const [checkinSettings, setCheckinSettings] = useState(CHECKIN_SETTINGS);
  const [editingSetting, setEditingSetting] = useState<string | null>(null);
  const [editSettingValue, setEditSettingValue] = useState("");

  // Owner state
  const [ownerName, setOwnerName] = useState("伊藤 さくら");
  const [ownerHandle, setOwnerHandle] = useState("@sakura.ito");
  const [editingOwner, setEditingOwner] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState("");

  return (
    <AdminPageShell
      breadcrumbs="HOME › 店舗 › 新規"
      title="店舗を登録"
      actions={
        <>
          <AdminBtn variant="ghost" onClick={() => { setDraftSaved(true); setTimeout(() => setDraftSaved(false), 2000); }}>{draftSaved ? "✓ 保存しました" : "下書き保存"}</AdminBtn>
          <AdminBtn onClick={() => { if (!shopName.trim()) { return; } setRegistered(true); }}>{registered ? "✓ 登録済み" : "登録してQRを発行"}</AdminBtn>
        </>
      }
    >
      <div className="flex flex-col md:flex-row overflow-hidden" style={{ minHeight: "calc(100vh - 120px)" }}>

        {/* Left: form */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-[640px]">

            {/* Shop image */}
            <div className="mb-3.5">
              <div className="text-[11.5px] font-semibold mb-1.5">店舗画像</div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-xl bg-[#f1f1f5] text-[#9a9aa0] text-[24px] font-bold flex-none"
                  style={{ width: 64, height: 64 }}
                >
                  {shopImage ? "✓" : "🏪"}
                </div>
                <AdminBtn variant="outline" onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = () => {
                    if (input.files && input.files.length > 0) {
                      setImageUploading(true);
                      setTimeout(() => { setImageUploading(false); setShopImage(true); }, 800);
                    }
                  };
                  input.click();
                }}>{imageUploading ? "アップロード中…" : "画像を変更"}</AdminBtn>
                <AdminBtn variant="ghost" onClick={() => setShopImage(false)}>削除</AdminBtn>
              </div>
            </div>

            {/* Shop name */}
            <div className="mb-3.5">
              <div className="text-[11.5px] font-semibold mb-1.5">
                店舗名 <span className="text-[#6666ff]">*</span>
              </div>
              <input
                className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center text-[12.5px] bg-white w-full outline-none focus:border-[#6666ff]"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
            </div>

            {/* 2-col grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
              <div>
                <div className="text-[11.5px] font-semibold mb-1.5">
                  カテゴリ <span className="text-[#6666ff]">*</span>
                </div>
                <input
                  className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center text-[12.5px] bg-white w-full outline-none focus:border-[#6666ff]"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div>
                <div className="text-[11.5px] font-semibold mb-1.5">営業時間</div>
                <input
                  className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center text-[12.5px] bg-white w-full outline-none focus:border-[#6666ff]"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-3.5">
              <div className="text-[11.5px] font-semibold mb-1.5">
                住所 <span className="text-[#6666ff]">*</span>
              </div>
              <input
                className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center text-[12.5px] bg-white w-full outline-none focus:border-[#6666ff]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* 2-col grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
              <div>
                <div className="text-[11.5px] font-semibold mb-1.5">代表者</div>
                <input
                  className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center text-[12.5px] bg-white w-full outline-none focus:border-[#6666ff]"
                  value={representative}
                  onChange={(e) => setRepresentative(e.target.value)}
                />
              </div>
              <div>
                <div className="text-[11.5px] font-semibold mb-1.5">
                  連絡先メール <span className="text-[#6666ff]">*</span>
                </div>
                <input
                  className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center text-[12.5px] font-mono bg-white w-full outline-none focus:border-[#6666ff]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <div className="text-[11.5px] font-semibold mb-0.5">紹介文 (任意)</div>
              <div className="text-[10.5px] text-[#9a9aa0] mb-1.5">
                お知らせや掲示板で参照される説明文
              </div>
              <textarea
                className="min-h-[60px] p-2.5 border border-[#dedee5] rounded-md text-[11.5px] text-[#525261] leading-[1.5] bg-white w-full outline-none focus:border-[#6666ff] resize-y"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Checkin settings */}
            <div className="text-[12px] font-bold text-[#525261] mt-4 mb-2.5">
              チェックイン設定
            </div>
            <div className="border border-[#dedee5] rounded-lg overflow-hidden mb-4">
              {checkinSettings.map(({ k, v }) => (
                <div key={k} className="flex items-center px-3.5 py-2 border-b border-[#dedee5] last:border-b-0 text-[11.5px]">
                  <span className="w-[130px] text-[#9a9aa0] flex-none">{k}</span>
                  {editingSetting === k ? (
                    <input
                      className="flex-1 px-2 py-1 border border-[#6666ff] rounded text-[11.5px] font-semibold outline-none"
                      value={editSettingValue}
                      onChange={(e) => setEditSettingValue(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setCheckinSettings(prev => prev.map(s => s.k === k ? {...s, v: editSettingValue} : s));
                          setEditingSetting(null);
                          setSavedSetting(k);
                          setTimeout(() => setSavedSetting(null), 1500);
                        }
                      }}
                    />
                  ) : (
                    <span className={`flex-1 font-semibold ${k.includes("報酬") ? "font-mono" : ""}`}>{v}</span>
                  )}
                  <button
                    className={`text-[10px] font-semibold cursor-pointer hover:underline ${savedSetting === k ? "text-green-600" : "text-[#6666ff]"}`}
                    onClick={() => {
                      if (editingSetting === k) {
                        setCheckinSettings(prev => prev.map(s => s.k === k ? {...s, v: editSettingValue} : s));
                        setEditingSetting(null);
                        setSavedSetting(k);
                        setTimeout(() => setSavedSetting(null), 1500);
                      } else {
                        setEditingSetting(k);
                        setEditSettingValue(v);
                      }
                    }}
                  >
                    {savedSetting === k ? "✓ 保存済" : editingSetting === k ? "保存" : "変更"}
                  </button>
                </div>
              ))}
            </div>

            {/* Owner */}
            <div className="text-[12px] font-bold text-[#525261] mb-2.5">
              オーナー (店舗管理者)
            </div>
            {editingOwner ? (
              <div className="flex items-center gap-3 p-3 border border-[#6666ff] rounded-lg bg-white">
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-[#525261] mb-1">新しいオーナーを選択</div>
                  <input
                    className="w-full px-2 py-1.5 border border-[#dedee5] rounded text-[12px] outline-none focus:border-[#6666ff]"
                    placeholder="名前で検索..."
                    value={ownerSearch}
                    onChange={(e) => setOwnerSearch(e.target.value)}
                  />
                  <div className="mt-2 flex flex-col gap-1">
                    {[
                      { name: "田中 太郎", handle: "@taro.tanaka" },
                      { name: "佐藤 一郎", handle: "@ichiro.sato" },
                      { name: "高橋 美咲", handle: "@misaki.takahashi" },
                    ].filter(m => !ownerSearch || m.name.includes(ownerSearch)).map(m => (
                      <button
                        key={m.handle}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#f1f1f5] text-left text-[12px]"
                        onClick={() => { setOwnerName(m.name); setOwnerHandle(m.handle); setEditingOwner(false); setOwnerSearch(""); }}
                      >
                        <Avatar size={20} label={m.name[0]} tone={0} />
                        <span className="font-semibold">{m.name}</span>
                        <span className="text-[10px] text-[#9a9aa0] font-mono">{m.handle}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button className="text-[10.5px] text-[#9a9aa0] cursor-pointer hover:underline self-start" onClick={() => setEditingOwner(false)}>キャンセル</button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 border border-[#dedee5] rounded-lg bg-[#f1f1f5]">
                <Avatar size={32} label={ownerName[0]} tone={1} />
                <div className="flex-1">
                  <div className="text-[12px] font-semibold">{ownerName}</div>
                  <div className="text-[10.5px] text-[#9a9aa0] font-mono">{ownerHandle}</div>
                </div>
                <button className="text-[10.5px] text-[#6666ff] font-semibold cursor-pointer hover:underline" onClick={() => setEditingOwner(true)}>変更</button>
              </div>
            )}
            <div className="text-[10.5px] text-[#9a9aa0] mt-1.5 leading-[1.5]">
              店舗オーナーは「運営者ビュー」で店舗QR表示・チェックイン状況確認・クーポン発行が可能
            </div>
          </div>
        </div>

        {/* Right: QR preview */}
        <div
          className="flex-none border-t md:border-t-0 md:border-l border-[#dedee5] bg-[#f1f1f5] p-4 md:p-6 overflow-y-auto w-full md:w-[340px]"
        >
          <div className="text-[12px] font-bold mb-3">QRプレビュー</div>

          <div
            onClick={() => setShowQr(true)}
            className="p-3.5 bg-white border border-[#dedee5] rounded-[10px] mb-3.5 cursor-pointer hover:border-[#9a9aa0] hover:shadow-sm transition-all"
            title="クリックして拡大表示"
          >
            <div className="text-[11.5px] font-bold mb-0.5">{shopName || "新富カフェ ことり"}</div>
            <div className="text-[10px] text-[#9a9aa0] mb-3">+10 DAO / チェックイン</div>
            <div className="flex justify-center py-1">
              <FakeQR size={160} />
            </div>
            <div className="text-[9.5px] text-[#9a9aa0] font-mono text-center mt-2">
              shop_kotori_a4f9c2
            </div>
            <div className="text-[9px] text-[#6666ff] text-center mt-1.5 font-semibold">
              クリックして拡大 ↗
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            {DOWNLOAD_OPTIONS.map((d) => (
              <button
                key={d}
                className="flex items-center gap-2 px-3 py-2 border border-[#dedee5] rounded-md bg-white text-[11px] cursor-pointer hover:border-[#9a9aa0] w-full text-left"
                onClick={() => {
                  const content = `QR Code: shop_kotori_a4f9c2\nFormat: ${d}\nGenerated: ${new Date().toISOString()}`;
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `qr_kotori_${d.replace(/\s/g, "_").toLowerCase()}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <span className="flex-1">{d}</span>
                <span className="text-[10px] text-[#6666ff] font-semibold">↓</span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-white border border-[#dedee5] rounded-lg text-[10.5px] text-[#525261] leading-[1.5]">
            ⓘ QRコードは保存後に確定します。期限切れ防止のため{" "}
            <strong>180日ごとに自動更新</strong>。
          </div>
        </div>
      </div>

      {/* ── QR Fullscreen Modal ── */}
      {showQr && (
        <div
          className="fixed inset-0 z-50 bg-[#1a1a1a]/90 flex flex-col items-center justify-center cursor-pointer"
          onClick={() => setShowQr(false)}
        >
          <div className="text-white text-[18px] font-bold mb-5">
            {shopName || "新富カフェ ことり"}
          </div>
          <div className="p-5 bg-white rounded-2xl shadow-2xl">
            <FakeQR size={280} />
          </div>
          <div className="text-[11px] text-white/60 font-mono mt-4">
            shop_kotori_a4f9c2
          </div>
          <div className="text-[13px] text-white/50 mt-6">
            タップして閉じる
          </div>
        </div>
      )}
    </AdminPageShell>
  );
}
