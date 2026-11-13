export interface Bounty {
  target_uuid: string;
  target_name: string;
  total_amount: number;
  created_at: number;
  contributors_count: number;
}

export interface Hunter {
  player_uuid: string;
  player_name: string;
  bounties_claimed: number;
  total_earned: number;
}

export interface Clan {
  name: string;
  tag: string;
  leader_uuid: string;
  activity_score: number;
  members_count: number;
}

export interface Overview {
  economy: {
    active_bounty_pool: number;
    total_claimed_volume: number;
    active_bounties_count: number;
    total_heads_claimed: number;
    total_clans: number;
  };
}