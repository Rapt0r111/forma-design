const KEY = 'forma:visitor-leads';

export type VisitorLead = {
  id: string;
  name: string;
  contact: string;
  area: number;
  package: string;
  note: string;
  status: string;
  amount: number;
  createdAt: string;
};

export function readVisitorLeads(): VisitorLead[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]') as unknown;
    return Array.isArray(parsed) ? (parsed as VisitorLead[]) : [];
  } catch {
    return [];
  }
}

export function rememberVisitorLead(lead: VisitorLead) {
  if (typeof window === 'undefined') return;
  try {
    const next = [lead, ...readVisitorLeads().filter((row) => row.id !== lead.id)].slice(0, 8);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
}

export function mergeRemoteLeads<T extends { id: string }>(remote: T[]): T[] {
  const extra = readVisitorLeads().filter((row) => !remote.some((lead) => lead.id === row.id)) as unknown as T[];
  return [...extra, ...remote];
}
