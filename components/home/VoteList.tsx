import type { Vote } from "@/mocks/types";

interface VoteListProps {
  votes: Vote[];
}

export function VoteList({ votes }: VoteListProps) {
  return (
    <div className="flex flex-col gap-2.5 p-4">
      {votes.map((v) => {
        const pct = Math.round((v.voted / v.total) * 100);
        return (
          <div key={v.id} className="border border-[#dedee5] rounded-xl p-3 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-[#6666ff] font-mono">投票受付中</span>
              <span className="text-[10px] text-[#9a9aa0]">{v.deadline}</span>
            </div>
            <div className="text-[13px] font-semibold mb-2 leading-snug">{v.title}</div>

            {/* 選択肢 */}
            <div className="flex flex-col gap-1.5 mb-3">
              {v.options.map((o) => {
                const optPct = Math.round((o.voteCount / v.total) * 100);
                return (
                  <div key={o.label} className="relative">
                    {/* バー */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-md bg-[#f2f2ff]"
                      style={{ width: `${optPct}%` }}
                    />
                    <div className="relative flex items-center justify-between px-2.5 py-1.5 rounded-md border border-[#dedee5] text-[11.5px]">
                      <span className="text-[#525261]">{o.label}</span>
                      <span className="text-[10px] font-mono text-[#9a9aa0]">{optPct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#9a9aa0]">
              <span>{v.voted} / {v.total}人 投票済</span>
              <span className="font-mono">{pct}%</span>
            </div>

            <button className="mt-2.5 w-full text-[12px] font-semibold py-2 rounded-[999px] bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors">
              投票する
            </button>
          </div>
        );
      })}
    </div>
  );
}
