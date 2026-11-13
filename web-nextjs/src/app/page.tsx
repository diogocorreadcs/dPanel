'use client';

import { useEffect, useState } from 'react';
import { Bounty, Clan, Hunter, Overview } from '@/types/dpanel';
import { deleteBounty, fetchDashboardData } from '@/services/api';
import { StatsGrid } from '@/components/StatsGrid';
import { WantedList } from '@/components/WantedList';
import { TopHunters } from '@/components/TopHunters';
import { TopClans } from '@/components/TopClans';

export default function Dashboard() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [hunters, setHunters] = useState<Hunter[]>([]);
  const [clans, setClans] = useState<Clan[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchDashboardData();
      setBounties(data.bounties);
      setHunters(data.hunters);
      setClans(data.clans);
      setOverview(data.overview);
    } catch (error) {
      console.error('Erro ao conectar com os microsserviços:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemoveBounty = async (uuid: string, name: string) => {
    if (!confirm(`Remover administrativamente a recompensa de ${name}?`)) return;
    await deleteBounty(uuid);
    loadData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="bg-amber-500 text-zinc-950 px-2.5 py-0.5 rounded font-black">dPanel</span>
              Network Dashboard
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Monitoramento integrado • <span className="text-amber-400">dBounty</span> &{' '}
              <span className="text-emerald-400">dClanSystem</span>
            </p>
          </div>
          <button
            onClick={loadData}
            className="bg-zinc-800 hover:bg-zinc-700 text-sm px-4 py-2 rounded-lg border border-zinc-700 transition cursor-pointer"
          >
            Atualizar Dados
          </button>
        </header>

        <StatsGrid overview={overview} />

        {loading ? (
          <p className="text-zinc-400 text-center py-12">Carregando dados do servidor...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WantedList bounties={bounties} onRemove={handleRemoveBounty} />
            <TopHunters hunters={hunters} />
            <TopClans clans={clans} />
          </div>
        )}
      </div>
    </div>
  );
}