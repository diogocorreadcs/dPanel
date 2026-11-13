import { Trophy } from 'lucide-react';
import { Hunter } from '@/types/dpanel';
import { formatMoney } from '@/services/api';

interface TopHuntersProps {
  hunters: Hunter[];
}

export function TopHunters({ hunters }: TopHuntersProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Trophy className="w-5 h-5 text-amber-400" />
        <h2 className="font-semibold text-lg">Top Caçadores</h2>
      </div>

      {hunters.length === 0 ? (
        <p className="text-zinc-500 text-sm py-4">Nenhum abate registrado ainda.</p>
      ) : (
        <div className="space-y-3">
          {hunters.map((h, index) => (
            <div
              key={h.player_uuid}
              className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-500 w-4">#{index + 1}</span>
                <img
                  src={`https://crafatar.com{h.player_uuid}?size=36&overlay`}
                  alt={h.player_name}
                  className="w-9 h-9 rounded"
                />
                <div>
                  <p className="font-medium text-sm">{h.player_name}</p>
                  <p className="text-xs text-zinc-500">{h.bounties_claimed} cabeças</p>
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-sm">{formatMoney(h.total_earned)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
