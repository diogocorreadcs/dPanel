import { Skull, Trash2 } from 'lucide-react';
import { Bounty } from '@/types/dpanel';
import { formatMoney } from '@/services/api';

interface WantedListProps {
  bounties: Bounty[];
  onRemove: (uuid: string, name: string) => void;
}

export function WantedList({ bounties, onRemove }: WantedListProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Skull className="w-5 h-5 text-rose-500" />
        <h2 className="font-semibold text-lg">Procurados ({bounties.length})</h2>
      </div>

      {bounties.length === 0 ? (
        <p className="text-zinc-500 text-sm py-4">Nenhuma recompensa ativa no momento.</p>
      ) : (
        <div className="space-y-3">
          {bounties.map((b) => (
            <div
              key={b.target_uuid}
              className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://crafatar.com{b.target_uuid}?size=36&overlay`}
                  alt={b.target_name}
                  className="w-9 h-9 rounded"
                />
                <div>
                  <p className="font-medium text-sm">{b.target_name}</p>
                  <p className="text-xs text-zinc-500">{b.contributors_count} contribuidor(es)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-amber-400 font-bold text-sm">{formatMoney(b.total_amount)}</span>
                <button
                  onClick={() => onRemove(b.target_uuid, b.target_name)}
                  title="Remover recompensa"
                  className="text-zinc-500 hover:text-rose-500 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}