import type { Session } from "next-auth";

export const TRIAL_DAYS = 7;

export function trialEndDate(from: Date = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + TRIAL_DAYS);
  return d;
}

export function isTrialActive(trialEndsAt?: Date | string | null): boolean {
  if (!trialEndsAt) return false;
  const end = trialEndsAt instanceof Date ? trialEndsAt : new Date(trialEndsAt);
  return end.getTime() > Date.now();
}

export function daysLeft(trialEndsAt?: Date | string | null): number {
  if (!trialEndsAt) return 0;
  const end = trialEndsAt instanceof Date ? trialEndsAt : new Date(trialEndsAt);
  const ms = end.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export type AccessState = {
  isLogged: boolean;
  isPremium: boolean;
  trialActive: boolean;
  trialDaysLeft: number;
  /** A user can watch any film if true. */
  canWatch: boolean;
};

export function getAccessState(session: Session | null): AccessState {
  const isLogged = !!session?.user;
  const isPremium = !!session?.user?.isPremium;
  const trialEndsAt = session?.user?.trialEndsAt ?? null;
  const trialActive = isTrialActive(trialEndsAt);
  return {
    isLogged,
    isPremium,
    trialActive,
    trialDaysLeft: daysLeft(trialEndsAt),
    canWatch: isPremium || trialActive,
  };
}
