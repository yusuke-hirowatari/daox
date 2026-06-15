"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TopBar, BackButton } from "@/components/atoms/TopBar";
import { Button } from "@/components/atoms/Button";
import { EmptyState } from "@/components/atoms/EmptyState";
import { EXCHANGE_ITEMS, MY_VOUCHERS } from "@/mocks/coupons";
import { DAO_BALANCE } from "@/mocks/wallet";
import type { ExchangeItem, ExchangeVoucher } from "@/mocks/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type CouponView =
  | "catalog"
  | "detail"
  | "exchange_success"
  | "my_list"
  | "use"
  | "use_success";

type PcMode = "catalog" | "my_list";

// ─── FakeQR ───────────────────────────────────────────────────────────────────

function QrFinder({ x, y, cell }: { x: number; y: number; cell: number }) {
  return (
    <g>
      <rect x={x} y={y} width={cell * 7} height={cell * 7} fill="#1a1a1a" />
      <rect x={x + cell} y={y + cell} width={cell * 5} height={cell * 5} fill="white" />
      <rect x={x + cell * 2} y={y + cell * 2} width={cell * 3} height={cell * 3} fill="#1a1a1a" />
    </g>
  );
}

function FakeQR({ size = 156 }: { size?: number }) {
  const N = 21;
  const cell = size / N;
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
          <rect
            key={`${col}-${row}`}
            x={col * cell}
            y={row * cell}
            width={cell}
            height={cell}
            fill="#1a1a1a"
          />
        );
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      {dots}
      <QrFinder x={0} y={0} cell={cell} />
      <QrFinder x={cell * 14} y={0} cell={cell} />
      <QrFinder x={0} y={cell * 14} cell={cell} />
    </svg>
  );
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function CouponIcon({
  ch,
  size = 44,
  dim,
}: {
  ch: string;
  size?: number;
  dim?: boolean;
}) {
  return (
    <div
      className={`flex-none flex items-center justify-center rounded-xl ${
        dim ? "bg-[#f1f1f5] opacity-50" : "bg-[#e8e8f0]"
      }`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {ch}
    </div>
  );
}

function CostPill({ amt, dim }: { amt: number; dim?: boolean }) {
  return (
    <span
      className={`text-[11px] font-mono font-bold px-[9px] py-[3px] rounded-full ${
        dim ? "bg-[#f1f1f5] text-[#9a9aa0]" : "bg-[#1a1a1a] text-white"
      }`}
    >
      {amt} DAO
    </span>
  );
}

function InfoRow({
  k,
  v,
  mono,
  muted,
}: {
  k: string;
  v: string;
  mono?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <span className="text-[11px] text-[#9a9aa0]">{k}</span>
      <span
        className={`text-[11px] ${muted ? "text-[#9a9aa0]" : "text-[#1a1a1a] font-semibold"} ${
          mono ? "font-mono" : ""
        }`}
      >
        {v}
      </span>
    </div>
  );
}

function fmtDate(iso: string): string {
  const parts = iso.split("-");
  return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CouponsPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><span className="text-[#9a9aa0] text-[13px]">読み込み中...</span></div>}>
      <CouponsPage />
    </Suspense>
  );
}

function CouponsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<CouponView>(searchParams.get("tab") === "my_list" ? "my_list" : "catalog");
  const [pcMode, setPcMode] = useState<PcMode>(searchParams.get("tab") === "my_list" ? "my_list" : "catalog");
  const [selectedTmpl, setSelectedTmpl] = useState<ExchangeItem | null>(null);
  const [selectedInst, setSelectedInst] = useState<ExchangeVoucher | null>(null);
  const [balance, setBalance] = useState(DAO_BALANCE);
  const [ownedCoupons, setOwnedCoupons] = useState<ExchangeVoucher[]>(MY_VOUCHERS);
  const [exchangeTxId, setExchangeTxId] = useState("");

  const [catalogFilter, setCatalogFilter] = useState(0);
  const [myListTab, setMyListTab] = useState(0);
  const [pcCatalogFilter, setPcCatalogFilter] = useState(0);
  const [pcMyListTab, setPcMyListTab] = useState(0);
  const [pcModalTmpl, setPcModalTmpl] = useState<ExchangeItem | null>(null);
  const [pcUseInst, setPcUseInst] = useState<ExchangeVoucher | null>(null);
  const [spQty, setSpQty] = useState(1);
  const [sortBy, setSortBy] = useState("人気順");

  const FILTERS = ["すべて", "飲食", "お買物", "理容・美容", "イベント"];
  const SORTS = ["人気順", "新着順", "価格 安い順", "価格 高い順"];

  const activeInstances = ownedCoupons.filter((c) => c.status === "active");
  const inactiveInstances = ownedCoupons.filter((c) => c.status !== "active");

  const seenIds = new Set<string>();
  const dedupedActive = activeInstances.filter((ci) => {
    if (seenIds.has(ci.itemId)) return false;
    seenIds.add(ci.itemId);
    return true;
  });

  const countByTmpl = activeInstances.reduce((m, ci) => {
    m.set(ci.itemId, (m.get(ci.itemId) ?? 0) + 1);
    return m;
  }, new Map<string, number>());

  // Sorted items for PC grid
  const sortedItems = [...EXCHANGE_ITEMS].sort((a, b) => {
    switch (sortBy) {
      case "人気順":
        return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
      case "新着順":
        return 0; // keep default order
      case "価格 安い順":
        return a.cost - b.cost;
      case "価格 高い順":
        return b.cost - a.cost;
      default:
        return 0;
    }
  });

  const handleOpenDetail = (tmpl: ExchangeItem) => {
    if (tmpl.isSoldout) return;
    setSelectedTmpl(tmpl);
    setSpQty(1);
    setView("detail");
  };

  const handleExchange = (tmpl: ExchangeItem) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + tmpl.validDays);
    const newInst: ExchangeVoucher = {
      id: `ci_${Date.now()}`,
      itemId: tmpl.id,
      title: tmpl.title,
      issuerName: tmpl.issuerName,
      icon: tmpl.icon,
      issuedAt: new Date().toISOString().slice(0, 10),
      expiresAt: expiry.toISOString().slice(0, 10),
      daysLeft: tmpl.validDays,
      status: "active",
      redeemCode: `EX-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${new Date().getDate()}`,
    };
    setBalance((b) => b - tmpl.cost);
    setOwnedCoupons((prev) => [newInst, ...prev]);
    setExchangeTxId(`cp_${Date.now().toString(16).slice(-8)}`);
  };

  const handleSpExchange = () => {
    if (!selectedTmpl) return;
    for (let i = 0; i < spQty; i++) handleExchange(selectedTmpl);
    setView("exchange_success");
  };

  const handleUse = (inst: ExchangeVoucher) => {
    setSelectedInst(inst);
    setView("use");
  };

  // ─── PC exchange ─────────────────────────────────────────────────────────
  const handlePcExchange = () => {
    if (!pcModalTmpl) return;
    handleExchange(pcModalTmpl);
    setPcModalTmpl(null);
  };

  // ─── PC Section ───────────────────────────────────────────────────────────

  const pcSection = (
    <div className="hidden md:flex flex-col h-full bg-white">
      {pcMode === "catalog" ? (
        <>
          <div className="flex flex-1 overflow-hidden">
            {/* Left filter */}
            <div className="w-[180px] flex-none border-r border-[#dedee5] bg-[#f1f1f5] px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
              {FILTERS.map((f, i) => (
                <button
                  key={f}
                  onClick={() => setPcCatalogFilter(i)}
                  className={`flex items-center px-3 py-2 rounded-md text-[12px] border transition-colors text-left ${
                    i === pcCatalogFilter
                      ? "font-semibold text-[#1a1a1a] bg-white border-[#dedee5]"
                      : "font-medium text-[#525261] bg-transparent border-transparent"
                  }`}
                >
                  <span className="flex-1">{f}</span>
                </button>
              ))}
              <div className="h-4" />
              <div className="text-[9.5px] text-[#9a9aa0] px-3 py-2 tracking-wide">並び順</div>
              {SORTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1.5 text-[11.5px] cursor-pointer text-left w-full transition-colors ${
                    s === sortBy ? "font-semibold text-[#1a1a1a] bg-white rounded-md" : "font-medium text-[#525261]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Center grid */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-3 gap-3">
                {sortedItems.map((c) => {
                  const out = c.isSoldout;
                  return (
                    <div
                      key={c.id}
                      onClick={() => !out && setPcModalTmpl(c)}
                      className={`p-3 border border-[#dedee5] rounded-xl bg-white flex flex-col gap-2 cursor-pointer hover:border-[#9a9aa0] transition-colors ${
                        out ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CouponIcon ch={c.icon} size={40} dim={out} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[12.5px] font-bold leading-snug">{c.title}</div>
                          <div className="text-[10.5px] text-[#525261] mt-0.5">{c.issuerName}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {c.isHot && (
                          <span className="text-[9px] font-bold px-[5px] py-[1px] rounded bg-[#eeeeff] text-[#6666ff]">
                            人気
                          </span>
                        )}
                        {c.isLimited && (
                          <span className="text-[9px] font-bold px-[5px] py-[1px] rounded bg-[#fff3d6] text-[#a06b00]">
                            期間限定
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono ml-auto ${
                            c.isLow ? "text-[#a06b00] font-bold" : "text-[#9a9aa0]"
                          }`}
                        >
                          {out ? "在庫切れ" : c.isLow ? `残り${c.stock}` : `在庫 ${c.stock}`}
                        </span>
                      </div>
                      <div className="flex items-center border-t border-[#dedee5] pt-2">
                        <CostPill amt={c.cost} dim={out} />
                        <span className="text-[10px] text-[#9a9aa0] ml-auto">{c.validDays}日有効</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PC Detail Modal */}
          {pcModalTmpl && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={() => setPcModalTmpl(null)}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]">
                  <div className="flex items-center px-5 py-3 border-b border-[#dedee5]">
                    <button onClick={() => setPcModalTmpl(null)} className="text-[18px] text-[#525261]">✕</button>
                    <span className="flex-1 text-center text-[13px] font-semibold">クーポン詳細</span>
                    <span className="w-5" />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="flex items-center gap-3.5 px-5 py-5 bg-[#f1f1f5] border-b border-[#dedee5]">
                      <CouponIcon ch={pcModalTmpl.icon} size={64} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[16px] font-bold mb-1">{pcModalTmpl.title}</div>
                        <div className="text-[11.5px] text-[#525261]">{pcModalTmpl.issuerName}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 px-5 py-4 border-b border-[#dedee5]">
                      <span className="text-[11px] text-[#9a9aa0]">必要DAO</span>
                      <span className="text-[32px] font-bold font-mono text-[#6666ff] leading-none">
                        {pcModalTmpl.cost}
                      </span>
                      <span className="text-[13px] font-semibold text-[#525261]">DAO</span>
                    </div>
                    <div className="flex items-center justify-between px-5 py-3 text-[11.5px] text-[#525261] border-b border-[#dedee5]">
                      <span>あなたの残高</span>
                      <span className="font-mono font-semibold">
                        {balance} <span className="text-[#9a9aa0]">→</span>{" "}
                        <span className="font-bold text-[#1a1a1a]">
                          {balance - pcModalTmpl.cost} DAO
                        </span>
                      </span>
                    </div>
                    <div className="px-5 py-2">
                      {[
                        ["有効期間", `引換から ${pcModalTmpl.validDays}日`],
                        ["利用条件", pcModalTmpl.description],
                        ["発行店舗", pcModalTmpl.issuerName],
                      ].map(([k, v]) => (
                        <div key={k} className="py-2 border-b border-[#dedee5] text-[11.5px]">
                          <div className="text-[#9a9aa0] mb-1">{k}</div>
                          <div className="text-[#1a1a1a]">{v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mx-4 mt-3 mb-4 px-3 py-2.5 bg-[#f1f1f5] rounded-lg text-[10.5px] text-[#525261] leading-relaxed">
                      <div className="font-bold text-[#1a1a1a] mb-1">引換時の注意</div>
                      引換後のキャンセル・払い戻しはできません。
                    </div>
                  </div>
                  <div className="flex gap-2 px-4 py-3.5 border-t border-[#dedee5]">
                    <Button variant="ghost" onClick={() => setPcModalTmpl(null)}>キャンセル</Button>
                    <Button full onClick={handlePcExchange}>
                      {pcModalTmpl.cost} DAO で引き換える
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        /* PC My List */
        <>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Tabs */}
            <div className="flex gap-3 mb-3.5">
              {[
                `使える (${activeInstances.length})`,
                `使用済み・期限切れ (${inactiveInstances.length})`,
              ].map((t, i) => (
                <button
                  key={t}
                  onClick={() => setPcMyListTab(i)}
                  className={`px-3.5 py-1.5 rounded-full border text-[11.5px] font-semibold whitespace-nowrap transition-colors ${
                    i === pcMyListTab
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "bg-transparent text-[#525261] border-[#dedee5]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {/* Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              {(pcMyListTab === 0 ? dedupedActive : inactiveInstances).map((c) => {
                const soon = c.daysLeft !== undefined && c.daysLeft <= 7;
                const count = countByTmpl.get(c.itemId) ?? 1;
                return (
                  <div
                    key={c.id}
                    className="p-4 border-[1.5px] border-[#dedee5] rounded-xl bg-white flex gap-3.5 items-center"
                  >
                    <CouponIcon ch={c.icon} size={56} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[13.5px] font-bold">{c.title}</span>
                        {count > 1 && (
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-lg bg-[#1a1a1a] text-white">
                            ×{count}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#525261]">{c.issuerName}</div>
                      {c.expiresAt && (
                        <div
                          className={`text-[10.5px] font-mono mt-1.5 ${
                            soon ? "text-[#a06b00] font-bold" : "text-[#9a9aa0]"
                          }`}
                        >
                          有効期限 {fmtDate(c.expiresAt)} (あと{c.daysLeft}日)
                        </div>
                      )}
                    </div>
                    {pcMyListTab === 0 && (
                      <button
                        onClick={() => setPcUseInst(c)}
                        className="text-[12px] font-bold px-3 py-2 rounded-full bg-[#1a1a1a] text-white whitespace-nowrap"
                      >
                        使う
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PC Use Modal */}
          {pcUseInst && (
            <>
              <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setPcUseInst(null)} />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
                  <div className="flex items-center px-4 py-2.5 border-b border-[#dedee5]">
                    <button onClick={() => setPcUseInst(null)} className="text-[18px] text-[#525261]">✕</button>
                    <div className="flex-1 text-center text-[13px] font-semibold">クーポンを使う</div>
                    <span className="w-5" />
                  </div>
                  <div className="flex flex-col items-center px-6 py-5">
                    <CouponIcon ch={pcUseInst.icon} size={56} />
                    <div className="text-[16px] font-bold mt-2.5 text-center">{pcUseInst.title}</div>
                    <div className="text-[11.5px] text-[#525261] mt-0.5">{pcUseInst.issuerName}</div>
                    <div className="mt-3.5 p-3.5 border-2 border-[#1a1a1a] rounded-xl">
                      <FakeQR size={160} />
                    </div>
                    <div className="mt-3 px-4 py-2 rounded-lg bg-[#f1f1f5] font-mono text-[14px] font-bold tracking-widest">
                      {pcUseInst.redeemCode}
                    </div>
                    <div className="mt-3 w-full px-3 py-3 border border-[#dedee5] rounded-xl space-y-1">
                      {pcUseInst.expiresAt && (
                        <InfoRow k="有効期限" v={`${fmtDate(pcUseInst.expiresAt)} (あと${pcUseInst.daysLeft}日)`} mono />
                      )}
                      <InfoRow k="発行日" v={fmtDate(pcUseInst.issuedAt)} mono />
                      <InfoRow k="クーポンID" v={pcUseInst.redeemCode} mono muted />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  // ─── SP: Catalog + Detail ─────────────────────────────────────────────────

  if (view === "catalog" || view === "detail") {
    return (
      <div className="flex flex-col h-full">
        {/* SP */}
        <div className="md:hidden flex flex-col h-full">
          <TopBar
            title="引換所"
            left={<BackButton onClick={() => router.back()} />}
            right={
              <button
                onClick={() => setView("my_list")}
                className="text-[11px] text-[#525261] font-semibold whitespace-nowrap"
              >
                持っているクーポン →
              </button>
            }
          />
          {/* Balance bar */}
          <div className="flex-none flex items-center gap-2.5 px-4 py-2.5 bg-[#1a1a1a] text-white">
            <span className="text-[10px] opacity-60 font-mono tracking-widest">BALANCE</span>
            <span className="text-[18px] font-bold font-mono">{balance}</span>
            <span className="text-[11px] opacity-70">DAO</span>
            <div className="flex-1" />
            <span className="text-[10.5px] opacity-70">持っているクーポン</span>
            <span className="text-[12px] font-bold font-mono px-2 py-0.5 rounded-full bg-white/15">
              {activeInstances.length}枚
            </span>
          </div>
          {/* Category filter pills */}
          <div className="flex-none flex gap-1.5 px-4 py-2 overflow-x-auto border-b border-[#dedee5]">
            {FILTERS.map((f, i) => (
              <button
                key={f}
                onClick={() => setCatalogFilter(i)}
                className={`flex-none text-[11px] px-3 py-[5px] rounded-full border whitespace-nowrap transition-colors ${
                  i === catalogFilter
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a] font-semibold"
                    : "bg-white text-[#525261] border-[#dedee5] font-medium"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Coupon list */}
          <div className="flex-1 overflow-y-auto">
            {EXCHANGE_ITEMS.map((c) => {
              const out = c.isSoldout;
              return (
                <div
                  key={c.id}
                  onClick={() => handleOpenDetail(c)}
                  className={`flex gap-3 px-4 py-3 border-b border-[#dedee5] cursor-pointer hover:bg-[#fafafa] transition-colors ${
                    out ? "opacity-55" : ""
                  }`}
                >
                  <CouponIcon ch={c.icon} dim={out} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[12.5px] font-bold leading-snug">{c.title}</span>
                      {c.isHot && (
                        <span className="text-[8.5px] font-bold px-[5px] py-[1px] rounded bg-[#eeeeff] text-[#6666ff]">
                          人気
                        </span>
                      )}
                      {c.isLimited && (
                        <span className="text-[8.5px] font-bold px-[5px] py-[1px] rounded bg-[#fff3d6] text-[#a06b00]">
                          期間限定
                        </span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-[#9a9aa0] mb-1">{c.issuerName}</div>
                    <div className="flex items-center gap-2">
                      <CostPill amt={c.cost} dim={out} />
                      <span
                        className={`text-[10px] font-mono ${
                          c.isLow ? "text-[#a06b00] font-bold" : "text-[#9a9aa0]"
                        }`}
                      >
                        {out ? "在庫切れ" : c.isLow ? `残り${c.stock}枚` : `在庫 ${c.stock}枚`}
                      </span>
                      <div className="flex-1" />
                      <span className="text-[10px] text-[#9a9aa0]">{c.validDays}日有効</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Sheet overlay */}
          {view === "detail" && selectedTmpl && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={() => setView("catalog")}
              />
              <div className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.1)] max-h-[85%] flex flex-col">
                <div className="flex-none flex justify-center py-2">
                  <div className="w-10 h-1 rounded-full bg-[#bbbbc0]" />
                </div>
                <div className="flex-none flex items-center px-5 pb-3 border-b border-[#dedee5]">
                  <button
                    onClick={() => setView("catalog")}
                    className="text-[18px] text-[#525261] w-6"
                  >
                    ✕
                  </button>
                  <span className="flex-1 text-center text-[13px] font-semibold">クーポン詳細</span>
                  <span className="w-6" />
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="flex items-center gap-3.5 px-5 py-5 bg-[#f1f1f5] border-b border-[#dedee5]">
                    <CouponIcon ch={selectedTmpl.icon} size={64} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[16px] font-bold mb-1">{selectedTmpl.title}</div>
                      <div className="text-[11.5px] text-[#525261]">{selectedTmpl.issuerName}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 px-5 py-4 border-b border-[#dedee5]">
                    <span className="text-[11px] text-[#9a9aa0]">必要DAO</span>
                    <span className="text-[32px] font-bold font-mono text-[#6666ff] leading-none">
                      {selectedTmpl.cost}
                    </span>
                    <span className="text-[13px] font-semibold text-[#525261]">DAO</span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3 text-[11.5px] text-[#525261] border-b border-[#dedee5]">
                    <span>あなたの残高</span>
                    <span className="font-mono font-semibold">
                      {balance} <span className="text-[#9a9aa0]">→</span>{" "}
                      <span className="font-bold text-[#1a1a1a]">
                        {balance - selectedTmpl.cost * spQty} DAO
                      </span>
                    </span>
                  </div>
                  <div className="px-5 py-2">
                    {[
                      ["有効期間", `引換から ${selectedTmpl.validDays}日`],
                      ["利用条件", selectedTmpl.description],
                      ["発行店舗", selectedTmpl.issuerName],
                    ].map(([k, v]) => (
                      <div key={k} className="py-2 border-b border-[#dedee5] text-[11.5px]">
                        <div className="text-[#9a9aa0] mb-1">{k}</div>
                        <div className="text-[#1a1a1a]">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mx-4 mt-3 mb-4 px-3 py-2.5 bg-[#f1f1f5] rounded-lg text-[10.5px] text-[#525261] leading-relaxed">
                    <div className="font-bold text-[#1a1a1a] mb-1">引換時の注意</div>
                    引換後のキャンセル・払い戻しはできません。クーポンは「持っているクーポン」に発行されます。
                  </div>
                </div>
                <div className="flex-none flex gap-2 px-4 py-3.5 border-t border-[#dedee5]">
                  {/* 数量 ± カウンター */}
                  <div className="flex items-center gap-1 border border-[#dedee5] rounded-full px-1">
                    <button
                      onClick={() => setSpQty((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 flex items-center justify-center text-[16px] text-[#525261] hover:bg-[#f1f1f5] rounded-full transition-colors"
                    >
                      −
                    </button>
                    <span className="text-[13px] font-semibold font-mono w-5 text-center">{spQty}</span>
                    <button
                      onClick={() => setSpQty((q) => Math.min(selectedTmpl.stock, q + 1))}
                      className="w-7 h-7 flex items-center justify-center text-[16px] text-[#525261] hover:bg-[#f1f1f5] rounded-full transition-colors"
                    >
                      ＋
                    </button>
                  </div>
                  <Button full onClick={handleSpExchange}>
                    {selectedTmpl.cost * spQty} DAO で引き換える
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {pcSection}
      </div>
    );
  }

  // ─── SP: Exchange success ─────────────────────────────────────────────────

  if (view === "exchange_success" && selectedTmpl) {
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full bg-white">
          <div className="flex-none flex items-center px-4 py-2.5 border-b border-[#dedee5]">
            <button
              onClick={() => setView("catalog")}
              className="text-[18px] text-[#525261]"
            >
              ✕
            </button>
            <div className="flex-1 text-center text-[13px] font-semibold">引換完了</div>
            <span className="w-5" />
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-7 pb-4">
            <div className="w-16 h-16 rounded-full bg-[#eeeeff] flex items-center justify-center text-[30px] font-bold text-[#6666ff] mb-3.5">
              ✓
            </div>
            <div className="text-[14px] text-[#525261]">クーポンを受け取りました</div>
            <div className="text-[22px] font-bold mt-1 text-center leading-snug">
              {selectedTmpl.title}
            </div>
            <div className="text-[11.5px] text-[#9a9aa0] mt-0.5">{selectedTmpl.issuerName}</div>

            {/* Preview card */}
            <div className="mt-5 w-full px-3.5 py-3.5 border-[1.5px] border-dashed border-[#1a1a1a] rounded-xl bg-[#f1f1f5] flex items-center gap-3">
              <CouponIcon ch={selectedTmpl.icon} size={48} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold">{selectedTmpl.title}</div>
                <div className="text-[10.5px] text-[#9a9aa0] mt-1">
                  有効期限 {selectedTmpl.validDays}日間 · 残り{selectedTmpl.validDays}日
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="mt-4 w-full px-3 py-3 border border-[#dedee5] rounded-xl space-y-1">
              <InfoRow k="支払い" v={`-${selectedTmpl.cost} DAO`} mono />
              <InfoRow k="残高" v={`${balance} DAO`} mono />
              <InfoRow k="取引ID" v={exchangeTxId} mono muted />
            </div>

            <div className="flex-1" />
            <div className="flex gap-2 w-full mt-4">
              <Button variant="ghost" full onClick={() => setView("catalog")}>
                もっと引き換える
              </Button>
              <Button
                full
                onClick={() => {
                  const first = ownedCoupons.find((c) => c.status === "active");
                  if (first) handleUse(first);
                }}
              >
                すぐ使う
              </Button>
            </div>
          </div>
        </div>
        {pcSection}
      </div>
    );
  }

  // ─── SP: My List ──────────────────────────────────────────────────────────

  if (view === "my_list") {
    const items = myListTab === 0 ? dedupedActive : inactiveInstances;
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full">
          <TopBar
            title="持っているクーポン"
            left={<BackButton onClick={() => setView("catalog")} />}
            right={
              <button
                onClick={() => setView("catalog")}
                className="text-[11px] text-[#525261] font-semibold whitespace-nowrap"
              >
                引換所 →
              </button>
            }
          />
          {/* Tabs */}
          <div className="flex-none flex border-b border-[#dedee5] px-3">
            {[
              `使える (${activeInstances.length})`,
              `使用済み・期限切れ (${inactiveInstances.length})`,
            ].map((label, i) => (
              <button
                key={label}
                onClick={() => setMyListTab(i)}
                className={`px-2.5 py-3 text-[12px] border-b-2 -mb-px transition-colors ${
                  i === myListTab
                    ? "font-semibold text-[#1a1a1a] border-[#1a1a1a]"
                    : "font-medium text-[#9a9aa0] border-transparent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <EmptyState
                variant="coupon"
                title={myListTab === 0 ? "クーポンがありません" : "使用済み・期限切れはありません"}
                sub={myListTab === 0 ? "引換所でDAOトークンと交換できます" : undefined}
              />
            ) : (
              items.map((c) => {
                const used = c.status === "used";
                const expired = c.status === "expired";
                const dim = used || expired;
                const soon = c.daysLeft !== undefined && c.daysLeft <= 7;
                const count = countByTmpl.get(c.itemId) ?? 1;
                return (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 px-4 py-3.5 border-b border-[#dedee5] ${
                      dim ? "opacity-55" : ""
                    }`}
                  >
                    <CouponIcon ch={c.icon} size={48} dim={dim} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[12.5px] font-bold">{c.title}</span>
                        {count > 1 && (
                          <span className="text-[9.5px] font-bold font-mono px-1.5 py-0.5 rounded-lg bg-[#1a1a1a] text-white">
                            ×{count}
                          </span>
                        )}
                      </div>
                      <div className="text-[10.5px] text-[#525261] mb-1">{c.issuerName}</div>
                      <div
                        className={`text-[10px] font-mono ${
                          soon ? "text-[#a06b00] font-bold" : "text-[#9a9aa0]"
                        }`}
                      >
                        {used && c.usedAt && <>使用済み · {fmtDate(c.usedAt)}</>}
                        {expired && c.expiresAt && <>期限切れ · {fmtDate(c.expiresAt)}</>}
                        {!dim && c.expiresAt && (
                          <>
                            有効期限 {fmtDate(c.expiresAt)}
                            {soon ? ` (あと${c.daysLeft}日)` : c.daysLeft ? ` 残り${c.daysLeft}日` : ""}
                          </>
                        )}
                      </div>
                    </div>
                    {!dim && (
                      <button
                        onClick={() => handleUse(c)}
                        className="text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-[#1a1a1a] text-white whitespace-nowrap"
                      >
                        使う
                      </button>
                    )}
                    {used && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#dfeede] text-[#3d6b3d]">
                        使用済
                      </span>
                    )}
                    {expired && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#f1f1f5] text-[#525261]">
                        期限切
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        {pcSection}
      </div>
    );
  }

  // ─── SP: Use QR ───────────────────────────────────────────────────────────

  if (view === "use" && selectedInst) {
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full bg-white">
          <div className="flex-none flex items-center gap-2.5 px-4 py-2.5 border-b border-[#dedee5]">
            <button
              onClick={() => setView("my_list")}
              className="text-[18px] text-[#525261]"
            >
              ✕
            </button>
            <div className="flex-1 text-center text-[13px] font-semibold">クーポンを使う</div>
            <span className="w-5" />
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-4 pb-4">
            <CouponIcon ch={selectedInst.icon} size={56} />
            <div className="text-[16px] font-bold mt-2.5 text-center">{selectedInst.title}</div>
            <div className="text-[11.5px] text-[#525261] mt-0.5">{selectedInst.issuerName}</div>

            {/* Warning */}
            <div className="mt-3.5 w-full flex gap-2 px-3 py-2.5 bg-[#fff3d6] rounded-lg text-[10.5px] text-[#7a5200] leading-relaxed">
              <span className="text-[14px] flex-none">⚠</span>
              <span>
                <strong>店員さんに見せてください。</strong> QRが読み取られると使用済みになります。
              </span>
            </div>

            {/* QR */}
            <div className="mt-4 p-3.5 border-2 border-[#1a1a1a] rounded-xl">
              <FakeQR size={160} />
            </div>

            {/* Code */}
            <div className="mt-3 px-4 py-2 rounded-lg bg-[#f1f1f5] font-mono text-[14px] font-bold tracking-widest">
              {selectedInst.redeemCode}
            </div>

            {/* Meta */}
            <div className="mt-3.5 w-full px-3 py-3 border border-[#dedee5] rounded-xl space-y-1">
              {selectedInst.expiresAt && (
                <InfoRow
                  k="有効期限"
                  v={`${fmtDate(selectedInst.expiresAt)} (あと${selectedInst.daysLeft}日)`}
                  mono
                />
              )}
              <InfoRow k="発行日" v={fmtDate(selectedInst.issuedAt)} mono />
              <InfoRow k="クーポンID" v={selectedInst.redeemCode} mono muted />
            </div>

            <div className="flex-1" />
            <button
              onClick={() => router.push("/dm")}
              className="mt-4 w-full py-3 rounded-xl border border-[#dedee5] text-[12px] font-semibold text-[#525261]"
            >
              使えませんでしたか? (運営に連絡)
            </button>
          </div>
        </div>
        {pcSection}
      </div>
    );
  }

  // ─── SP: Use Success ──────────────────────────────────────────────────────

  if (view === "use_success" && selectedInst) {
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full bg-white">
          <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-9 pb-4">
            <div className="w-[76px] h-[76px] rounded-full bg-[#dfeede] flex items-center justify-center text-[36px] font-bold text-[#3d6b3d]">
              ✓
            </div>
            <div className="text-[14px] text-[#525261] mt-4.5">使用しました</div>
            <div className="text-[20px] font-bold mt-1 text-center">{selectedInst.title}</div>
            <div className="text-[11.5px] text-[#9a9aa0] mt-0.5">{selectedInst.issuerName}</div>

            <div className="mt-5 w-full px-3 py-3 border border-[#dedee5] rounded-xl space-y-1">
              <InfoRow
                k="使用時刻"
                v={new Date().toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                mono
              />
              <InfoRow k="クーポンID" v={selectedInst.redeemCode} mono muted />
            </div>

            {/* Social prompt */}
            <div className="mt-4 w-full flex gap-2 px-3 py-2.5 bg-[#f1f1f5] rounded-lg text-[11px] text-[#525261] leading-relaxed">
              <span className="text-[14px] flex-none">💬</span>
              <span>
                お店の感想を <strong className="text-[#1a1a1a]">掲示板</strong> でシェアしませんか?
                <br />
                投稿で +15 XP
              </span>
            </div>

            <div className="flex-1" />
            <div className="flex gap-2 w-full mt-4">
              <Button variant="ghost" full onClick={() => setView("my_list")}>
                持っているクーポン
              </Button>
              <Button full onClick={() => router.push("/home")}>
                感想を投稿
              </Button>
            </div>
          </div>
        </div>
        {pcSection}
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex flex-col h-full">
      <div className="md:hidden flex flex-col h-full" />
      {pcSection}
    </div>
  );
}
