import { DollarSign, Trophy, Skull, Shield } from 'lucide-react';
import { Overview } from '@/types/dpanel';
import { formatMoney } from '@/services/api';

interface StatsGridProps {
  overview: Overview | null;
}

export function StatsGrid({ overview }: StatsGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
        <div className="flex items-center justify-between text-zinc-400 text-sm">
          <span>Em Recompensas Ativas</span>
          <DollarSign className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-2xl font-bold mt-2 text-amber-400">
          {formatMoney(overview?.economy.active_bounty_pool || 0)}
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
        <div className="flex items-center justify-between text-zinc-400 text-sm">
          <span>Total Pago aos Caçadores</span>
          <Trophy className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-2xl font-bold mt-2 text-emerald-400">
          {formatMoney(overview?.economy.total_claimed_volume || 0)}
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
        <div className="flex items-center justify-between text-zinc-400 text-sm">
          <span>Cabeças Resgatadas</span>
          <Skull className="w-4 h-4 text-rose-400" />
        </div>
        <p className="text-2xl font-bold mt-2 text-white">
          {overview?.economy.total_heads_claimed || 0}
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
        <div className="flex items-center justify-between text-zinc-400 text-sm">
          <span>Clãs Registrados</span>
          <Shield className="w-4 h-4 text-sky-400" />
        </div>
        <p className="text-2xl font-bold mt-2 text-white">
          {overview?.economy.total_clans || 0}
        </p>
      </div>
    </section>
  );
}