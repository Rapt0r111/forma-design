import { createLead, listLeads, storageKind, updateLead } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const windowMs = 60_000;
const limits = { GET: 60, POST: 12, PATCH: 30 } as const;
const hits = globalThis as typeof globalThis & { showcaseHits?: Map<string, number[]> };

function clientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local';
}

function limited(request: Request, method: keyof typeof limits) {
  const store = (hits.showcaseHits ??= new Map<string, number[]>());
  const key = `${method}:${clientKey(request)}`;
  const now = Date.now();
  const recent = (store.get(key) || []).filter((time: number) => now - time < windowMs);
  if (recent.length >= limits[method]) return true;
  recent.push(now);
  store.set(key, recent);
  return false;
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const requestHost = request.headers.get('host');
  if (requestHost && host === requestHost) return true;
  const extra = process.env.ALLOWED_ORIGIN?.trim();
  if (extra) {
    try {
      return new URL(extra).host === host;
    } catch {
      return extra === origin;
    }
  }
  return false;
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request) {
  if (limited(request, 'GET')) return json({ error: 'Слишком много запросов. Подождите минуту.' }, 429);
  try {
    return json({ leads: await listLeads(), storage: storageKind() });
  } catch {
    return json({ error: 'Не удалось прочитать заявки. Попробуйте ещё раз.' }, 500);
  }
}

async function mutate(request: Request, update: boolean) {
  if (!sameOrigin(request)) return json({ error: 'Запрос с другого сайта отклонён' }, 403);
  if (limited(request, update ? 'PATCH' : 'POST')) return json({ error: 'Слишком много запросов. Подождите минуту.' }, 429);
  if (Number(request.headers.get('content-length')) > 16000) return json({ error: 'Слишком большой запрос' }, 413);
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 16000) throw new Error();
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Некорректный запрос' }, 400);
  }
  try {
    return json({ lead: await (update ? updateLead(body) : createLead(body)), storage: storageKind() }, update ? 200 : 201);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    return json({ error: err.code ? 'Не удалось сохранить данные. Попробуйте ещё раз.' : err.message }, err.code ? 500 : 400);
  }
}

export async function POST(request: Request) {
  return mutate(request, false);
}
export async function PATCH(request: Request) {
  return mutate(request, true);
}
