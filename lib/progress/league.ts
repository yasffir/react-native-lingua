import { getIsoWeekNumber } from "@/lib/progress/dates";

export interface LeagueTier {
  name: string;
  minXp: number;
  weekLabel: string;
}

const TIERS: { name: string; minXp: number }[] = [
  { name: "Bronze", minXp: 0 },
  { name: "Silver", minXp: 150 },
  { name: "Gold", minXp: 500 },
  { name: "Platinum", minXp: 1000 },
];

export function getLeagueFromTotalXp(totalXp: number): LeagueTier {
  let tier = TIERS[0];
  for (const t of TIERS) {
    if (totalXp >= t.minXp) tier = t;
  }
  return {
    name: tier.name,
    minXp: tier.minXp,
    weekLabel: `WEEK ${getIsoWeekNumber(new Date())}`,
  };
}
