import type { Notice } from "@/mocks/types";

interface NoticeListProps {
  notices: Notice[];
}

export function NoticeList({ notices }: NoticeListProps) {
  return (
    <div className="flex flex-col">
      {/* ピン留めヘッダ */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-[#f2f2ff] text-[10.5px] font-bold text-[#6666ff] tracking-wide shrink-0">
        <span>📌 ピン留め</span>
        <span className="text-[#9a9aa0] font-normal text-[10px]">運営からの重要なお知らせ</span>
      </div>

      {notices.map((n) => (
        <div
          key={n.id}
          className="flex gap-2.5 px-4 py-3.5 border-b border-[#dedee5] cursor-pointer hover:bg-[#f1f1f5] transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-[3px]"
                style={
                  n.tag === "重要"
                    ? { background: "#f2f2ff", color: "#6666ff" }
                    : { background: "#dedee5", color: "#525261" }
                }
              >
                {n.tag}
              </span>
              <span className="text-[10px] text-[#9a9aa0] font-mono">{n.date}</span>
            </div>
            <div className="text-[12.5px] font-semibold mb-1 leading-snug">{n.title}</div>
            <div className="text-[11px] text-[#525261] leading-snug line-clamp-2">{n.body}</div>
          </div>
        </div>
      ))}

      {/* 過去ログ導線 */}
      <div className="py-4 text-center">
        <button className="text-[11px] text-[#525261] font-semibold px-3.5 py-1.5 rounded-[999px] border border-[#bbbbc0] bg-white hover:bg-[#f1f1f5] transition-colors">
          過去のお知らせを見る
        </button>
      </div>
    </div>
  );
}
