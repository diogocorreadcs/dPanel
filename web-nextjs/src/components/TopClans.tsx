import { Shield, Users, Activity } from 'lucide-react';
import { Clan } from '@/types/dpanel';

interface TopClansProps {
  clans: Clan[];
}

export function TopClans({ clans }: TopClansProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Shield className="w-5 h-5 text-sky-400" />
        <h2 className="font-semibold text-lg">Top Clãs</h2>
      </div>

      {clans.length === 0 ? (
        <p className="text-zinc-500 text-sm py-4">Nenhum clã sincronizado ainda.</p>
      ) : (
        <div className="space-y-3">
          {clans.map((c, index) => (
            <div
              key={c.name}
              className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-500 w-4">#{index + 1}</span>
                <div>
                  <p className="font-medium text-sm">
                    <span className="text-sky-400 font-bold">[{c.tag}]</span> {c.name}
                  </p>
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <Users className="w-3 h-3" /> {c.members_count} membro(s)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-zinc-200 font-bold text-sm flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> {c.activity_score}
                </span>
                <span className="text-[10px] text-zinc-500 uppercase">Atividade</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
