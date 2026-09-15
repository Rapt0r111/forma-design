import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const rates = { concept: 2500, full: 4500, supervision: 6000 } as const;
export type Stage = 'new' | 'contact' | 'proposal' | 'won';
export type PackageId = keyof typeof rates;
export type Lead = {
  id: string;
  name: string;
  contact: string;
  area: number;
  package: PackageId;
  note: string;
  status: Stage;
  amount: number;
  createdAt: string;
};
export type StorageKind = 'file' | 'kv' | 'memory';

export function parseLead(value: unknown) {
  const data = value as Record<string, unknown> | null;
  if (!data || typeof data !== 'object') throw new Error('Некорректные данные');
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const contact = typeof data.contact === 'string' ? data.contact.trim() : '';
  const area = Number(data.area);
  const pack = data.package as PackageId;
  const note = typeof data.note === 'string' ? data.note.trim() : '';
  if (!name || name.length > 100) throw new Error('Укажите имя, не более 100 символов');
  if (!contact || contact.length > 150) throw new Error('Укажите контакт, не более 150 символов');
  if (!Number.isFinite(area) || area < 20 || area > 500) throw new Error('Площадь должна быть от 20 до 500 м²');
  if (!Object.hasOwn(rates, pack)) throw new Error('Выберите пакет услуг');
  if (note.length > 2000) throw new Error('Комментарий: не более 2000 символов');
  return { name, contact, area, package: pack, note, amount: Math.round(area * rates[pack]) };
}

const demoRows = [
  ['Анна · демо', 'anna@example.com', 84, 'full', 'new', 'Квартира для семьи. Нужна отдельная рабочая зона.'],
  ['Михаил · демо', 'mikhail@example.com', 120, 'supervision', 'proposal', 'Обсудить материалы и этапы реализации.'],
  ['София · демо', 'sofia@example.com', 56, 'concept', 'contact', 'Светлая палитра, натуральное дерево.'],
  ['Алексей · демо', 'alex@example.com', 72, 'full', 'won', 'Концепция согласована. Демонстрационная сделка.'],
  ['Елена · демо', 'elena@example.com', 98, 'full', 'new', 'Нужен расчёт полного дизайн-проекта.'],
] as const;

function seeds(): Lead[] {
  return demoRows.map((r, i) => ({
    id: `demo-${i + 1}`,
    name: r[0],
    contact: r[1],
    area: r[2],
    package: r[3],
    status: r[4],
    note: r[5],
    amount: r[2] * rates[r[3]],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

const KV_KEY = 'forma:leads';
const state = globalThis as typeof globalThis & {
  showcaseWrites?: Promise<unknown>;
  showcaseCache?: Lead[];
};

function kvUrl() {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
}
function kvToken() {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
}
function kvConfigured() {
  return Boolean(kvUrl() && kvToken());
}
function filePreferred() {
  if (process.env.SHOWCASE_DATA_DIR) return true;
  if (process.env.VERCEL) return false;
  return true;
}

export function storageKind(): StorageKind {
  if (filePreferred()) return 'file';
  if (kvConfigured()) return 'kv';
  return 'memory';
}

function location() {
  return process.env.SHOWCASE_DATA_DIR || path.join(process.cwd(), 'data');
}

function asLeads(value: unknown): Lead[] | null {
  if (!Array.isArray(value)) return null;
  return value.filter((row): row is Lead => {
    if (!row || typeof row !== 'object') return false;
    const lead = row as Lead;
    return typeof lead.id === 'string' && typeof lead.name === 'string' && typeof lead.contact === 'string';
  });
}

async function readFileStore(): Promise<Lead[]> {
  try {
    const parsed = asLeads(JSON.parse(await readFile(path.join(location(), 'leads.json'), 'utf8')));
    return parsed ?? seeds();
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return seeds();
    throw e;
  }
}

async function writeFileStore(leads: Lead[]) {
  const dir = location();
  await mkdir(dir, { recursive: true });
  const temporary = path.join(dir, `${randomUUID()}.tmp`);
  await writeFile(temporary, JSON.stringify(leads, null, 2), 'utf8');
  await rename(temporary, path.join(dir, 'leads.json'));
}

async function kvCommand(args: string[]) {
  const res = await fetch(kvUrl(), {
    method: 'POST',
    headers: { Authorization: `Bearer ${kvToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Не удалось обратиться к хранилищу заявок.');
  return (await res.json()) as { result: unknown };
}

async function readKv(): Promise<Lead[] | null> {
  const payload = await kvCommand(['GET', KV_KEY]);
  const raw = payload.result;
  if (raw == null || raw === '') return null;
  try {
    return asLeads(typeof raw === 'string' ? JSON.parse(raw) : raw);
  } catch {
    return null;
  }
}

async function writeKv(leads: Lead[]) {
  await kvCommand(['SET', KV_KEY, JSON.stringify(leads)]);
}

async function read(): Promise<Lead[]> {
  if (filePreferred()) return readFileStore();
  if (state.showcaseCache) return state.showcaseCache;
  if (kvConfigured()) {
    try {
      state.showcaseCache = (await readKv()) ?? seeds();
      return state.showcaseCache;
    } catch {
      state.showcaseCache = seeds();
      return state.showcaseCache;
    }
  }
  state.showcaseCache = seeds();
  return state.showcaseCache;
}

async function write(leads: Lead[]) {
  if (filePreferred()) {
    await writeFileStore(leads);
    return;
  }
  state.showcaseCache = leads;
  if (kvConfigured()) {
    try {
      await writeKv(leads);
    } catch {
      // Memory still holds the row for this instance.
    }
  }
}

function transact<T>(operation: () => Promise<T>): Promise<T> {
  const next = (state.showcaseWrites || Promise.resolve()).then(operation, operation);
  state.showcaseWrites = next.catch(() => {});
  return next;
}

export async function listLeads() {
  await state.showcaseWrites;
  return read();
}

export async function createLead(data: unknown) {
  const values = parseLead(data);
  return transact(async () => {
    const leads = await read();
    const lead: Lead = { ...values, id: randomUUID(), status: 'new', createdAt: new Date().toISOString() };
    await write([lead, ...leads]);
    return lead;
  });
}

function validId(id: unknown): id is string {
  return typeof id === 'string' && id.length > 0 && id.length <= 80;
}

export async function updateLead(data: unknown) {
  const value = data as Record<string, unknown> | null;
  if (!value || !validId(value.id)) throw new Error('Не указана заявка');
  const id = value.id;
  if (value.status !== undefined && !['new', 'contact', 'proposal', 'won'].includes(value.status as string)) {
    throw new Error('Неизвестный статус');
  }
  if (value.note !== undefined && (typeof value.note !== 'string' || value.note.length > 2000)) {
    throw new Error('Комментарий: не более 2000 символов');
  }
  return transact(async () => {
    const leads = await read();
    const lead = leads.find((row) => row.id === id);
    if (!lead) {
      const adopted: Lead = {
        ...parseLead(value),
        id,
        status: (typeof value.status === 'string' && ['new', 'contact', 'proposal', 'won'].includes(value.status)
          ? value.status
          : 'new') as Stage,
        createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date().toISOString(),
      };
      await write([adopted, ...leads]);
      return adopted;
    }
    if (value.status !== undefined) lead.status = value.status as Stage;
    if (value.note !== undefined) lead.note = (value.note as string).trim();
    await write(leads);
    return lead;
  });
}
