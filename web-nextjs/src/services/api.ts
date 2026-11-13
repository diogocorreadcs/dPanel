import { Bounty, Clan, Hunter, Overview } from '@/types/dpanel';

const NODE_API_URL = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3333';
const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';
const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';

export function formatMoney(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
}

export async function fetchDashboardData() {
  const [resBounties, resHunters, resClans, resOverview] = await Promise.all([
    fetch(`${NODE_API_URL}/api/bounties`),
    fetch(`${NODE_API_URL}/api/bounties/top-hunters`),
    fetch(`${NODE_API_URL}/api/clans`),
    fetch(`${PYTHON_API_URL}/analytics/overview`),
  ]);

  const bounties: Bounty[] = resBounties.ok ? await resBounties.json() : [];
  const hunters: Hunter[] = resHunters.ok ? await resHunters.json() : [];
  const clans: Clan[] = resClans.ok ? await resClans.json() : [];
  const overview: Overview | null = resOverview.ok ? await resOverview.json() : null;

  return { bounties, hunters, clans, overview };
}

export async function deleteBounty(uuid: string): Promise<void> {
  await fetch(`${NODE_API_URL}/api/bounties/${uuid}`, {
    method: 'DELETE',
    headers: {
      'x-api-key': ADMIN_API_KEY,
    },
  });
}