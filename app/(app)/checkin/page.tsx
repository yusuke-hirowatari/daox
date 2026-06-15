"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TopBar, BackButton } from "@/components/atoms/TopBar";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { Divider } from "@/components/atoms/Divider";

type CheckinView = "start" | "camera" | "confirm" | "success" | "operator";

const SHOP = {
  name: "新富カフェ ことり",
  emoji: "☕",
  category: "飲食店",
  address: "新富町2-3-1",
  reward: 10,
  streak: 5,
  bonus: 2,
  visitCount: 3,
};
const MONTHLY_COUNT = 14;
const RECENT_CHECKINS = [
  { who: "田中", tone: 0, time: "12:34", pts: 10 },
  { who: "伊藤", tone: 1, time: "12:18", pts: 10 },
  { who: "佐藤", tone: 2, time: "11:55", pts: 10 },
  { who: "木村", tone: 3, time: "11:32", pts: 10 },
  { who: "高橋", tone: 4, time: "10:48", pts: 10 },
];

// ────────────────────────────────────────────
// Screen 1 · スキャン起動
// ────────────────────────────────────────────
function StartView({ onScan, onOperator }: { onScan: () => void; onOperator: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Big scan button */}
        <button
          onClick={onScan}
          className="w-[180px] h-[180px] rounded-full bg-[#1a1a1a] text-white flex flex-col items-center justify-center gap-2 hover:bg-[#333] transition-colors active:scale-95 select-none"
        >
          <span className="text-[44px] leading-none">⌖</span>
          <span className="text-[13px] font-semibold">QRをスキャン</span>
        </button>

        <p className="mt-8 text-[12px] text-[#9a9aa0] text-center leading-relaxed">
          お店や施設にあるQRコードを
          <br />
          カメラで読み取ってください
        </p>

        {/* Monthly count chip */}
        <div className="mt-6 px-3.5 py-2.5 bg-[#f1f1f5] rounded-lg text-[11px] text-[#9a9aa0] flex items-center gap-2">
          <span className="text-[14px]">◷</span>
          今月のチェックイン:{" "}
          <strong className="text-[#1a1a1a]">{MONTHLY_COUNT}回</strong>
        </div>

        {/* Operator view toggle */}
        <button
          onClick={onOperator}
          className="mt-5 text-[11px] text-[#6666ff] font-semibold"
        >
          運営者ビューに切り替え ›
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Screen 2 · カメラ (QRスキャン)
// ────────────────────────────────────────────
function CameraView({ onScan, onClose }: { onScan: () => void; onClose: () => void }) {
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const mountedRef = useRef(false);

  const handleScan = useCallback(() => {
    onScan();
  }, [onScan]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    let active = true;

    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode("qr-camera-feed");
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 200, height: 200 } },
          () => {
            if (active) {
              active = false;
              scanner.stop().finally(handleScan);
            }
          },
          () => {} // suppress per-frame errors
        );
      } catch {
        // Camera unavailable — mock button shown below
      }
    })();

    return () => {
      active = false;
      scannerRef.current?.stop().catch(() => {});
    };
  }, [handleScan]);

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1916] overflow-hidden flex flex-col">
      {/* Camera feed background */}
      <div id="qr-camera-feed" className="absolute inset-0 overflow-hidden" />

      {/* UI overlay */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top bar */}
        <div className="flex-none flex items-center gap-3 px-[18px] py-3.5 text-white">
          <button onClick={onClose} className="text-[18px] leading-none p-1 -ml-1">
            ✕
          </button>
          <span className="flex-1 text-[14px] font-semibold">QRコードをスキャン</span>
          <span className="text-[16px] opacity-70">⚡</span>
        </div>

        {/* Viewfinder */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-[220px] h-[220px]">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-7 h-7 border-t-[3px] border-l-[3px] border-[#6666ff] rounded-tl-[4px]" />
            <div className="absolute top-0 right-0 w-7 h-7 border-t-[3px] border-r-[3px] border-[#6666ff] rounded-tr-[4px]" />
            <div className="absolute bottom-0 left-0 w-7 h-7 border-b-[3px] border-l-[3px] border-[#6666ff] rounded-bl-[4px]" />
            <div className="absolute bottom-0 right-0 w-7 h-7 border-b-[3px] border-r-[3px] border-[#6666ff] rounded-br-[4px]" />
            {/* Scanning line */}
            <div
              className="absolute left-3 right-3 h-[2px] bg-[#6666ff]"
              style={{
                opacity: 0.7,
                boxShadow: "0 0 8px #6666ff",
                animation: "scanline 2s ease-in-out infinite alternate",
              }}
            />
          </div>
        </div>

        {/* Bottom hint + mock button */}
        <div className="flex-none pb-9 pt-6 px-6 text-center text-white">
          <p className="text-[13px] opacity-90 mb-1.5">QRコードを枠内に合わせてください</p>
          <p className="text-[10.5px] opacity-55 font-mono mb-5">自動で読み取ります</p>
          <button
            onClick={handleScan}
            className="px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white text-[11.5px] font-semibold"
          >
            テスト: スキャン成功（モック）
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Screen 3 · チェックイン確認
// ────────────────────────────────────────────
function ConfirmView({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const now = new Date();
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const dateStr = `${now.getMonth() + 1}/${now.getDate()}(${days[now.getDay()]}) ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col h-full">
      <TopBar title="チェックイン確認" left={<BackButton onClick={onCancel} />} />

      <div className="flex-1 flex flex-col p-5 overflow-y-auto">
        {/* Shop card */}
        <div className="border-[1.5px] border-[#1a1a1a] rounded-xl p-4 bg-white text-center mb-4">
          <div className="w-[60px] h-[60px] rounded-full bg-[#dedee5] mx-auto mb-2.5 flex items-center justify-center text-[24px]">
            {SHOP.emoji}
          </div>
          <div className="text-[16px] font-bold mb-0.5">{SHOP.name}</div>
          <div className="text-[10.5px] text-[#9a9aa0]">
            {SHOP.category} · {SHOP.address}
          </div>
        </div>

        {/* Reward preview */}
        <div className="p-4 bg-[#f1f1f5] rounded-xl flex items-center justify-between mb-2">
          <div>
            <div className="text-[10.5px] text-[#9a9aa0] mb-0.5">獲得予定</div>
            <div className="flex items-baseline gap-1">
              <span className="text-[28px] font-bold font-mono text-[#6666ff] leading-none">
                +{SHOP.reward}
              </span>
              <span className="text-[12px] text-[#525261] font-semibold">DAO</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10.5px] text-[#9a9aa0] mb-0.5">連続</div>
            <div className="text-[13px] font-bold text-[#1a1a1a]">{SHOP.streak}日目</div>
          </div>
        </div>

        {/* Bonus chip */}
        <div className="px-2.5 py-1.5 bg-[#f2f2ff] rounded-md text-[10.5px] text-[#6666ff] font-semibold text-center mb-4">
          連続ボーナス +{SHOP.bonus} DAO
        </div>

        {/* Meta */}
        <div className="text-[10.5px] text-[#9a9aa0]">
          <div className="flex justify-between py-1">
            <span>日時</span>
            <span>{dateStr}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>このお店への訪問回数</span>
            <span>{SHOP.visitCount}回目</span>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col gap-2 pt-4">
          <Button full onClick={onConfirm}>チェックインする</Button>
          <Button full variant="ghost" onClick={onCancel}>キャンセル</Button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Screen 4 · チェックイン完了
// ────────────────────────────────────────────
function SuccessView({ onHome }: { onHome: () => void }) {
  const total = SHOP.reward + SHOP.bonus;
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Check circle */}
        <div className="w-[88px] h-[88px] rounded-full bg-[#6666ff] flex items-center justify-center text-white text-[44px] mb-7 select-none">
          ✓
        </div>
        <h1 className="text-[22px] font-bold text-center mb-1.5">チェックイン完了</h1>
        <p className="text-[13px] text-[#525261] text-center mb-6">{SHOP.name}</p>

        {/* DAO amount */}
        <div className="px-7 py-5 bg-[#f1f1f5] rounded-xl flex items-baseline gap-1 mb-6">
          <span className="text-[12px] text-[#9a9aa0]">+</span>
          <span className="text-[40px] font-bold font-mono text-[#6666ff] leading-none">{total}</span>
          <span className="text-[14px] text-[#525261] font-semibold ml-1">DAO</span>
        </div>

        {/* Streak info */}
        <div className="px-3.5 py-2 bg-[#dedee5] rounded-md text-[11px] text-[#525261] mb-9">
          連続 {SHOP.streak}日 ・ ボーナス +{SHOP.bonus} DAO 獲得
        </div>

        <div className="w-full flex flex-col gap-2">
          <Button full onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "DAOX チェックイン", text: "チェックインしました！" });
            } else {
              navigator.clipboard.writeText("チェックインしました！ #DAOX");
            }
          }}>シェアする</Button>
          <Button full variant="ghost" onClick={onHome}>ホームに戻る</Button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// 運営者ビュー
// ────────────────────────────────────────────
function OperatorView({ onBack }: { onBack: () => void }) {
  const [showQr, setShowQr] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="新富カフェ ことり"
        sub="運営者ビュー"
        left={<BackButton onClick={onBack} />}
        right={
          <button
            onClick={() => window.location.href = "/admin/shops"}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5] text-[14px]"
          >
            ⚙
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Stats row */}
        <div className="p-4 pb-3 flex gap-2">
          <div className="flex-1 p-3 bg-[#f1f1f5] rounded-lg">
            <div className="text-[10px] text-[#9a9aa0] mb-1">今日</div>
            <div className="text-[22px] font-bold font-mono leading-none">23</div>
            <div className="text-[9px] text-[#9a9aa0] mt-1">来店数</div>
          </div>
          <div className="flex-1 p-3 bg-[#f1f1f5] rounded-lg">
            <div className="text-[10px] text-[#9a9aa0] mb-1">今月</div>
            <div className="text-[22px] font-bold font-mono leading-none">312</div>
            <div className="text-[9px] text-[#9a9aa0] mt-1">来店数</div>
          </div>
          <div className="flex-1 p-3 bg-[#1a1a1a] text-white rounded-lg">
            <div className="text-[10px] opacity-70 mb-1">付与</div>
            <div className="text-[22px] font-bold font-mono leading-none">3,120</div>
            <div className="text-[9px] opacity-70 mt-1">今月 DAO</div>
          </div>
        </div>

        {/* Shop QR card */}
        <div className="px-4 pb-3">
          <div
            onClick={() => setShowQr(true)}
            className="bg-white border-[1.5px] border-dashed border-[#1a1a1a] rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[#fafafa] transition-colors"
          >
            {/* Mini QR mock */}
            <div className="w-12 h-12 rounded-md bg-[#1a1a1a] relative flex-none overflow-hidden">
              <div
                className="absolute inset-1.5 rounded-sm"
                style={{
                  backgroundImage:
                    "repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%)",
                  backgroundSize: "8px 8px",
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold">店舗QR表示</div>
              <div className="text-[10.5px] text-[#9a9aa0] mt-0.5">
                お客様にスキャンしてもらう
              </div>
            </div>
            <span className="text-[16px] text-[#9a9aa0]">↗</span>
          </div>
        </div>

        <Divider />

        {/* Recent checkins */}
        <div className="px-4 py-2.5 text-[11px] font-semibold text-[#525261]">
          最近のチェックイン
        </div>
        {RECENT_CHECKINS.map((r, i) => (
          <div key={i} className="px-4 py-2 flex items-center gap-2.5">
            <Avatar size={26} label={r.who[0]} tone={r.tone} />
            <span className="flex-1 text-[12px]">{r.who} さん</span>
            <span className="text-[10px] text-[#9a9aa0] font-mono">{r.time}</span>
            <span className="text-[10px] text-[#6666ff] font-bold font-mono">
              +{r.pts}
            </span>
          </div>
        ))}
      </div>

      {/* Fullscreen QR Modal */}
      {showQr && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
          <div className="text-[16px] font-bold mb-4">{SHOP.name}</div>
          <div className="p-4 border-2 border-[#1a1a1a] rounded-xl">
            <svg width={240} height={240} viewBox="0 0 240 240" className="block">
              {(() => {
                const N = 21;
                const cell = 240 / N;
                const dots: React.ReactElement[] = [];
                for (let row = 0; row < N; row++) {
                  for (let col = 0; col < N; col++) {
                    const tl = col < 7 && row < 7;
                    const tr = col > 13 && row < 7;
                    const bl = col < 7 && row > 13;
                    if (tl || tr || bl) continue;
                    const seed = (col * 7 + row * 13 + col * row) % 5;
                    if (seed < 2) {
                      dots.push(
                        <rect key={`${col}-${row}`} x={col * cell} y={row * cell} width={cell} height={cell} fill="#1a1a1a" />
                      );
                    }
                  }
                }
                return dots;
              })()}
              {/* Finder patterns */}
              {[
                [0, 0],
                [240 / 21 * 14, 0],
                [0, 240 / 21 * 14],
              ].map(([fx, fy], idx) => {
                const c = 240 / 21;
                return (
                  <g key={idx}>
                    <rect x={fx} y={fy} width={c * 7} height={c * 7} fill="#1a1a1a" />
                    <rect x={fx + c} y={fy + c} width={c * 5} height={c * 5} fill="white" />
                    <rect x={fx + c * 2} y={fy + c * 2} width={c * 3} height={c * 3} fill="#1a1a1a" />
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-[12px] text-[#9a9aa0] mt-4">お客様にこのQRコードをスキャンしてもらってください</p>
          <button
            onClick={() => setShowQr(false)}
            className="mt-6 px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-[13px] font-semibold"
          >
            閉じる
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// Root page component
// ────────────────────────────────────────────
export default function CheckinPage() {
  const [view, setView] = useState<CheckinView>("start");

  const goCamera = useCallback(() => setView("camera"), []);
  const goConfirm = useCallback(() => setView("confirm"), []);
  const goSuccess = useCallback(() => setView("success"), []);
  const goStart = useCallback(() => setView("start"), []);
  const goOperator = useCallback(() => setView("operator"), []);

  if (view === "camera") return <CameraView onScan={goConfirm} onClose={goStart} />;
  if (view === "confirm") return <ConfirmView onConfirm={goSuccess} onCancel={goStart} />;
  if (view === "success") return <SuccessView onHome={goStart} />;
  if (view === "operator") return <OperatorView onBack={goStart} />;
  return <StartView onScan={goCamera} onOperator={goOperator} />;
}
