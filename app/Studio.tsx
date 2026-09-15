'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  Check,
  Menu,
  X,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react';
import { AuthorContact, Brand, BrandMark } from './brand';
import { author, authorMailto } from '@/lib/contact';
import { money } from '@/lib/money';
import { rememberVisitorLead } from '@/lib/visitor';

const rooms = [
  { image: '/interior.webp', name: 'Тихий ритм', type: 'Квартира · 84 м²', text: 'Тёплое дерево, мягкий свет и пространство без лишних деталей.' },
  { image: '/living.webp', name: 'Свет внутри', type: 'Квартира · 120 м²', text: 'Открытая планировка, спокойные фактуры и естественный свет.' },
  { image: '/detail.webp', name: 'Новая классика', type: 'Дом · 156 м²', text: 'Лаконичные формы и выразительные детали для неспешной жизни.' },
];
const HERO_MS = 7000;

const packages = [
  { id: 'concept', name: 'Концепция', rate: 2500, detail: 'Планировка, палитра и настроение пространства.', includes: ['Планировка', 'Палитра', 'Moodboard'] },
  { id: 'full', name: 'Дизайн-проект', rate: 4500, detail: 'Концепция, визуализации и комплект чертежей.', includes: ['Визуализации', 'Чертежи', 'Спецификация'] },
  { id: 'supervision', name: 'Полное ведение', rate: 6000, detail: 'Дизайн-проект и сопровождение реализации.', includes: ['Авторский надзор', 'Поставщики', 'До последнего штриха'] },
] as const;

const ticker = ['Свет', 'Тишина', 'Текстура', 'Воздух', 'Дерево', 'Ритм', 'Пропорции', 'Касание', 'Тепло', 'Пустота'];
const cycleWords = ['света', 'тишины', 'ритма', 'воздуха'];
const palette = [
  { name: 'Лён', color: '#d9cbb8' },
  { name: 'Шампань', color: '#e4c28a' },
  { name: 'Олива', color: '#8a9373' },
  { name: 'Графит', color: '#3a3b35' },
  { name: 'Мел', color: '#f4efe6' },
];

function finePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}
function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function magMove(e: React.MouseEvent<HTMLElement>) {
  if (!finePointer() || reducedMotion()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
  const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
  el.style.setProperty('--mx', `${x.toFixed(2)}px`);
  el.style.setProperty('--my', `${y.toFixed(2)}px`);
}
function magLeave(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--mx', '0px');
  e.currentTarget.style.setProperty('--my', '0px');
}
function spotMove(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--sx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--sy', `${e.clientY - r.top}px`);
}

function Mag({
  className = '',
  children,
  href,
  type,
  disabled,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}) {
  const inner = <span className="btn-inner">{children}</span>;
  if (href?.startsWith('/')) {
    return (
      <Link href={href} className={className} onMouseMove={magMove} onMouseLeave={magLeave}>
        {inner}
      </Link>
    );
  }
  if (href) {
    const offsite = href.startsWith('http');
    return (
      <a
        href={href}
        className={className}
        onMouseMove={magMove}
        onMouseLeave={magLeave}
        {...(offsite ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={className} disabled={disabled} onClick={onClick} onMouseMove={magMove} onMouseLeave={magLeave}>
      {inner}
    </button>
  );
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => {
      el.classList.remove('will-reveal');
      el.classList.add('is-in');
    };
    if (reducedMotion() || el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      show();
      return;
    }
    el.classList.add('will-reveal');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Tilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || !finePointer() || reducedMotion()) return;
    el.classList.add('is-live');
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${((0.5 - y) * 4).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x - 0.5) * 5).toFixed(2)}deg`);
  }
  function leave() {
    const el = ref.current;
    if (!el) return;
    el.classList.remove('is-live');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }
  return (
    <div ref={ref} className="tilt" onMouseMove={move} onMouseLeave={leave}>
      {children}
    </div>
  );
}

function useCount(value: number) {
  const [n, setN] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (reducedMotion()) {
      setN(value);
      from.current = value;
      return;
    }
    const a = from.current;
    const b = value;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 640);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(a + (b - a) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return n;
}

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    document.documentElement.classList.add('has-cursor');
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const tick = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden />
    </>
  );
}

const flowStages = [
  { id: 'new', label: 'Новые' },
  { id: 'contact', label: 'На связи' },
  { id: 'proposal', label: 'Предложение' },
  { id: 'won', label: 'Сделка' },
] as const;

function DealFlow() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [hold, setHold] = useState(false);
  const room = rooms[1];
  const pack = packages[1];
  const area = 120;
  const amount = area * pack.rate;
  const stage = flowStages[step];

  useEffect(() => {
    if (reducedMotion()) {
      setStep(flowStages.length - 1);
      return;
    }
    const el = root.current;
    if (!el) return;
    let timer = 0;
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const play = () => {
      if (timer || hold) return;
      timer = window.setInterval(() => {
        setStep((s) => (s + 1) % flowStages.length);
      }, 2000);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else stop();
      },
      { threshold: 0.32 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [hold]);

  return (
    <aside ref={root} className="why-stage" aria-label="Как заявка идёт по этапам">
      <figure className="why-photo">
        <img src={room.image} alt={room.text} loading="lazy" decoding="async" width={1800} height={1200} />
        <figcaption>{room.name}</figcaption>
      </figure>
      <div className="why-flow spot" onMouseMove={spotMove}>
        <p className="eyebrow">ПОТОК</p>
        <h3>Заявка не теряется.</h3>
        <p>Сразу на доске: новые, на связи, предложение, сделка.</p>
        <div className="why-pipe" style={{ ['--step' as string]: step }} role="group" aria-label="Этапы заявки">
          <span className="why-pipe-line" aria-hidden>
            <i />
          </span>
          {flowStages.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-current={i === step ? 'step' : undefined}
              className={i === step ? 'is-on' : i < step ? 'is-done' : ''}
              onClick={() => {
                setHold(true);
                setStep(i);
              }}
            >
              <span className="why-dot" />
              {item.label}
            </button>
          ))}
        </div>
        <article className={step === 3 ? 'why-card is-won' : 'why-card'}>
          <span className="why-status">
            {step === 3 ? <Check size={14} /> : null}
            {stage.label}
          </span>
          <span className="why-demo">Пример</span>
          <h4>{room.name}</h4>
          <p>
            {pack.name} · {area} м²
          </p>
          <strong>{money(amount)} ₽</strong>
        </article>
      </div>
    </aside>
  );
}

function WordCycle({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), 2800);
    return () => window.clearInterval(id);
  }, [words.length]);
  return (
    <>
      <span className="sr-only">{words[i]}</span>
      <span className="cycle" aria-hidden>
        {words.map((word, n) => (
          <span key={word} className={n === i ? 'is-on' : ''}>
            {word}.
          </span>
        ))}
      </span>
    </>
  );
}

const faq = [
  {
    q: 'Это настоящая студия?',
    a: 'FORMA — учебный бренд для портфолио. Интерьеры на фотографиях — референсы, не выполненные заказы. Заявка сохраняется только в демо-контуре. Написать автору: Telegram @Rapt0r111 или raptorfun111@gmail.com.',
  },
  {
    q: 'Как считается стоимость?',
    a: 'Ориентир = площадь × ставка пакета. Ставки условные: концепция 2 500 ₽/м², дизайн-проект 4 500 ₽/м², полное ведение 6 000 ₽/м².',
  },
  {
    q: 'Что происходит с заявкой?',
    a: 'Она сразу появляется в демо-CRM «ПОТОК». Там можно сменить этап, добавить заметку и выгрузить CSV — без писем и звонков.',
  },
  {
    q: 'Сколько занимает проект?',
    a: 'В этой модели концепция занимает ориентировочно 2–4 недели, полный проект — 5–8. Это демонстрационные сроки, не оферта.',
  },
  {
    q: 'Как связаться с автором?',
    a: 'Telegram @Rapt0r111 или почта raptorfun111@gmail.com. Демозаявки на сайте никуда не уходят — это контур портфолио.',
  },
];

export default function Studio() {
  const [room, setRoom] = useState(0);
  const [menu, setMenu] = useState(false);
  const [area, setArea] = useState(84);
  const [pack, setPack] = useState(1);
  const [step, setStep] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [hold, setHold] = useState(false);
  const [heroOn, setHeroOn] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const [sticky, setSticky] = useState(false);
  const [compact, setCompact] = useState(false);
  const [docked, setDocked] = useState(false);
  const [toTop, setToTop] = useState(false);
  const light = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const remain = useRef(HERO_MS);
  const estimateRef = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [fieldError, setFieldError] = useState<{ name?: string; contact?: string }>({});
  const valid = Number.isFinite(area) && area >= 20 && area <= 500;
  const sliderArea = valid ? area : 84;
  const total = valid ? area * packages[pack].rate : 0;
  const shown = useCount(total);
  const active = rooms[room];

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    if (!menu) return;
    const panel = sheet.current;
    const previous = document.activeElement as HTMLElement | null;
    const focusable = () => {
      const inSheet = Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)') ?? []);
      return menuBtn.current ? [menuBtn.current, ...inSheet] : inSheet;
    };
    const firstLink = panel?.querySelector<HTMLElement>('a[href]');
    firstLink?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenu(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const els = focusable();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [menu]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    remain.current = HERO_MS;
  }, [room]);

  useEffect(() => {
    const frozen = hold || !heroOn || hidden || reducedMotion();
    if (frozen) return;
    const t0 = performance.now();
    const id = window.setTimeout(() => {
      remain.current = HERO_MS;
      setRoom((r) => (r + 1) % rooms.length);
    }, remain.current);
    return () => {
      window.clearTimeout(id);
      remain.current = Math.max(80, remain.current - (performance.now() - t0));
    };
  }, [hold, heroOn, hidden, room]);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (menu || !heroOn) return;
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') setRoom((r) => (r + 1) % rooms.length);
      if (e.key === 'ArrowLeft') setRoom((r) => (r + rooms.length - 1) % rooms.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu, heroOn]);

  useEffect(() => {
    const hero = document.querySelector('.studio-hero');
    const estimate = estimateRef.current;
    if (!hero || !estimate) return;
    let seenHero = true;
    let estimateOn = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) {
            seenHero = entry.isIntersecting;
            setHeroOn(entry.isIntersecting);
          }
          if (entry.target === estimate) estimateOn = entry.isIntersecting;
        }
        setSticky(!seenHero && !estimateOn);
      },
      { threshold: 0.12 },
    );
    io.observe(hero);
    io.observe(estimate);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = reducedMotion();
    document.documentElement.classList.toggle('scroll-motion', !reduce);
    let raf = 0;
    let tracked = Array.from(document.querySelectorAll<HTMLElement>('[data-track]'));
    const tick = () => {
      raf = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const p = max > 0 ? root.scrollTop / max : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${p})`;
      setCompact(root.scrollTop > 48);
      setDocked(root.scrollTop > Math.max(360, window.innerHeight - 80));
      setToTop(root.scrollTop > 480);
      if (reduce) return;
      const vh = window.innerHeight;
      tracked.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (el.dataset.track === 'pin') {
          const range = Math.max(1, el.offsetHeight - vh);
          const t = Math.min(1, Math.max(0, -r.top / range));
          el.style.setProperty('--sp', t.toFixed(4));
        } else {
          const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
          const mid = (vh * 0.5 - (r.top + r.height * 0.5)) / vh;
          el.style.setProperty('--sp', t.toFixed(4));
          el.style.setProperty('--sm', mid.toFixed(4));
        }
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function heroMove(e: React.MouseEvent<HTMLElement>) {
    if (!finePointer() || !light.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    light.current.style.setProperty('--lx', `${e.clientX - r.left}px`);
    light.current.style.setProperty('--ly', `${e.clientY - r.top}px`);
  }

  function heroSwipeStart(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target instanceof Element && e.target.closest('a, button')) return;
    swipe.current = { x: e.clientX, y: e.clientY };
  }

  function heroSwipeEnd(e: React.PointerEvent<HTMLElement>) {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    setRoom((r) => (r + (dx < 0 ? 1 : rooms.length - 1)) % rooms.length);
  }

  function releaseHold(e: React.FocusEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const contact = String(data.get('contact') ?? '').trim();
    const note = String(data.get('note') ?? '').trim();
    const next: { name?: string; contact?: string } = {};
    if (name.length < 2) next.name = 'Укажите имя — хотя бы два символа.';
    if (contact.length < 5) next.contact = 'Укажите телефон или email.';
    else if (!/[0-9@]/.test(contact)) next.contact = 'Нужен номер с цифрами или адрес со знаком @.';
    setFieldError(next);
    if (next.name || next.contact) return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setPending(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ac.signal,
        body: JSON.stringify({
          name,
          contact,
          note,
          area,
          package: packages[pack].id,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(typeof json.error === 'string' ? json.error : 'Не удалось сохранить заявку.');
      setSaved(json.lead.id);
      rememberVisitorLead(json.lead);
      setStep(3);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setError(e instanceof Error ? e.message : 'Не удалось сохранить заявку. Проверьте соединение и попробуйте ещё раз.');
    } finally {
      setPending(false);
    }
  }

  function goEstimate(nextPack?: number) {
    if (typeof nextPack === 'number') setPack(nextPack);
    setMenu(false);
    document.getElementById('estimate')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  function showRoom(i: number) {
    setRoom(i);
    document.querySelector('.studio-hero')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  return (
    <div className="studio">
      <a className="skip" href="#main">
        К содержанию
      </a>
      <Cursor />
      <div className="scroll-progress" aria-hidden>
        <span ref={progress} />
      </div>
      <header className={`nav${compact ? ' is-compact' : ''}${docked ? ' is-docked' : ''}`}>
        <Brand />
        <nav aria-label="Основная навигация">
          <a href="#projects">Пространства</a>
          <a href="#approach">Подход</a>
          <a href="#packages">Пакеты</a>
          <Link href="/desk">
            ПОТОК <ArrowUpRight size={14} />
          </Link>
        </nav>
        <div className="nav-actions">
          <Mag className="btn btn-glass nav-contact" href={author.telegram}>
            <Send size={15} /> <span className="nav-contact-label">Связь</span>
          </Mag>
          <Mag className="btn btn-primary nav-cta" href="#estimate">
            Рассчитать проект
          </Mag>
        </div>
        <a
          className="mobile-contact"
          href={author.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в Telegram"
        >
          <Send size={16} />
        </a>
        <button
          ref={menuBtn}
          className="mobile-menu"
          onClick={() => setMenu(!menu)}
          aria-label={menu ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menu}
          aria-controls="studio-menu"
        >
          {menu ? <X size={18} /> : <Menu size={18} />}
          <span>{menu ? 'Закрыть' : 'Меню'}</span>
        </button>
      </header>
      <div
        ref={sheet}
        id="studio-menu"
        className={menu ? 'nav-sheet open' : 'nav-sheet'}
        role="dialog"
        aria-modal={menu}
        aria-labelledby="studio-menu-title"
        aria-hidden={!menu}
      >
        <p id="studio-menu-title" className="sr-only">Меню</p>
        <a href="#projects" onClick={() => setMenu(false)}>Пространства</a>
        <a href="#approach" onClick={() => setMenu(false)}>Подход</a>
        <a href="#packages" onClick={() => setMenu(false)}>Пакеты</a>
        <a href="#estimate" onClick={() => setMenu(false)}>Расчёт</a>
        <Link href="/desk" onClick={() => setMenu(false)}>ПОТОК — CRM</Link>
        <Mag className="btn btn-primary" href={author.telegram}>
          Написать в Telegram <Send size={16} />
        </Mag>
        <AuthorContact compact />
      </div>

      <main id="main" inert={menu ? true : undefined}>
        <section
          className={hold || !heroOn || hidden ? 'studio-hero is-paused' : 'studio-hero'}
          style={{ ['--hero-ms' as string]: `${HERO_MS}ms` }}
          data-track="view"
          aria-label="Интерьеры FORMA"
          onMouseMove={heroMove}
          onPointerDown={heroSwipeStart}
          onPointerUp={heroSwipeEnd}
          onPointerCancel={() => {
            swipe.current = null;
          }}
        >
          <div className="hero-plates" aria-hidden>
            {rooms.map((r, i) => (
              <img
                key={r.image}
                className={i === room ? 'hero-image is-on' : 'hero-image'}
                src={r.image}
                alt=""
                fetchPriority={i === 0 ? 'high' : 'auto'}
                decoding="async"
                draggable={false}
                width={1707}
                height={1280}
              />
            ))}
          </div>
          <div className="hero-shade" />
          <div ref={light} className="hero-light" aria-hidden />
          <div className="hero-copy">
            <div className="hero-top">
              <span className="demo-tag">Студия · концепт 2027</span>
            </div>
            <div className="hero-mid">
              <h1>
                Ваше место.
                <br />
                Ваша <em>форма</em> жизни.
              </h1>
              <p className="hero-lead">
                Проектируем квартиры и дома вокруг <WordCycle words={cycleWords} />
                <span className="hero-sub">От первого эскиза до сопровождения стройки.</span>
              </p>
              <div className="hero-actions">
                <Mag className="btn btn-primary" href="#estimate">
                  Рассчитать стоимость <ArrowUpRight size={18} />
                </Mag>
                <Mag className="btn btn-glass" href={author.telegram}>
                  Связь в Telegram <Send size={16} />
                </Mag>
              </div>
            </div>
            <div
              className="hero-caption"
              onMouseEnter={() => setHold(true)}
              onMouseLeave={() => setHold(false)}
              onFocusCapture={() => setHold(true)}
              onBlurCapture={releaseHold}
            >
              <p className="hero-caption-copy" key={active.name}>
                <strong>{active.name}</strong>
                <span>{active.type}</span>
              </p>
              <div className="hero-progress" aria-hidden>
                {rooms.map((r, i) => (
                  <span key={r.name} className={i === room ? 'is-on' : i < room ? 'is-done' : ''}>
                    {i === room ? <i key={room} /> : <i />}
                  </span>
                ))}
              </div>
              <div className="hero-film" role="group" aria-label="Выбор интерьера">
                {rooms.map((r, i) => (
                  <button
                    key={r.name}
                    type="button"
                    className={i === room ? 'is-on' : ''}
                    onClick={() => setRoom(i)}
                    aria-label={r.name}
                    aria-pressed={i === room}
                  >
                    <img src={r.image} alt="" decoding="async" width={96} height={64} />
                  </button>
                ))}
              </div>
              <div className="hero-controls">
                <button
                  type="button"
                  onClick={() => setRoom((room + rooms.length - 1) % rooms.length)}
                  aria-label="Предыдущий интерьер"
                >
                  <ArrowLeft size={16} />
                </button>
                <button type="button" onClick={() => setRoom((room + 1) % rooms.length)} aria-label="Следующий интерьер">
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="sr-only" aria-live="polite">
                {active.name}. {active.type}
              </p>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden>
          <div className="marquee-track">
            {[...ticker, ...ticker].map((item, i) => (
              <span key={`${item}-${i}`}>
                {item}
                <b />
              </span>
            ))}
          </div>
        </div>

        <section className="stage" data-track="pin" aria-label="Пространство раскрывается">
          <div className="stage-sticky">
            <div className="stage-head">
              <p className="eyebrow">Сцена</p>
              <h2 className="stage-title">
                Пространство <em>раскрывается</em> вместе со скроллом.
              </h2>
            </div>
            <div className="stage-frame">
              {rooms.map((r, i) => (
                <img key={r.name} src={r.image} alt="" className="stage-shot" style={{ ['--i' as string]: i }} loading="lazy" decoding="async" width={1707} height={1280} />
              ))}
              <div className="stage-glass" />
              <div className="stage-meta">
                <strong>Квартира и дом</strong>
                <span>Три настроения · один скролл</span>
              </div>
            </div>
          </div>
        </section>

        <section className="lookbook" data-track="pin" aria-label="Три характера">
          <div className="lookbook-sticky">
            <div className="lookbook-head">
              <div>
                <p className="eyebrow">Галерея</p>
                <h2>
                  Три характера. <em>Один ритм.</em>
                </h2>
              </div>
              <p className="lookbook-hint">Листайте вниз — кадры идут горизонтально</p>
            </div>
            <div className="lookbook-viewport">
              <div className="lookbook-track">
                {rooms.map((r, i) => (
                  <article key={r.name} className="lookbook-slide">
                    <figure>
                      <img src={r.image} alt={r.text} loading="lazy" decoding="async" width={1707} height={1280} />
                    </figure>
                    <div className="lookbook-copy">
                      <span className="lookbook-num">0{i + 1}</span>
                      <h3>{r.name}</h3>
                      <p className="lookbook-type">{r.type}</p>
                      <p>{r.text}</p>
                      <Mag className="btn btn-glass" type="button" onClick={() => showRoom(i)}>
                        Открыть в герое <ArrowUpRight size={16} />
                      </Mag>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="look-progress" aria-hidden>
              {rooms.map((r, i) => (
                <span key={r.name} style={{ ['--i' as string]: i }} />
              ))}
            </div>
          </div>
        </section>

        <section className="section intro section-narrow">
          <Reveal>
            <p className="eyebrow">Манифест</p>
            <h2>
              Хороший интерьер
              <br />
              начинается <em>с вас.</em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p>
              Не с картинки. С того, как вы встречаете утро, собираете друзей и находите время для себя. Из этих деталей складывается дом, который чувствуешь своим — и который хочется показать.
            </p>
            <div className="palette" aria-label="Палитра студии">
              {palette.map((swatch) => (
                <span key={swatch.name} className="swatch">
                  <i style={{ background: swatch.color }} />
                  {swatch.name}
                </span>
              ))}
            </div>
            <div className="stat-row">
              <div className="stat">
                <strong>20–500</strong>
                <span>м² в рабочем диапазоне</span>
              </div>
              <div className="stat">
                <strong>от {money(20 * 2500)}</strong>
                <span>₽ за концепцию студии</span>
              </div>
              <div className="stat">
                <strong>30 сек</strong>
                <span>до ориентира по стоимости</span>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="why" className="section" aria-label="Почему FORMA">
          <div className="why">
            <Reveal className="why-offer">
              <p className="eyebrow">Почему FORMA</p>
              <h2>
                Считаем вслух.
                <br />
                Ведём до <em>сделки.</em>
              </h2>
              <p>Цена на экране, заявка в CRM, этапы без мессенджерного хаоса. Дизайн, который продаёт пространство — и сам процесс.</p>
              <ul className="why-proofs">
                <li>
                  <Check size={16} />
                  <span>
                    <strong>30 сек</strong> до ориентира по стоимости
                  </span>
                </li>
                <li>
                  <Check size={16} />
                  <span>
                    <strong>3 пакета</strong> без скрытых ступеней
                  </span>
                </li>
                <li>
                  <Check size={16} />
                  <span>
                    <strong>Цена</strong> сразу на экране
                  </span>
                </li>
              </ul>
              <div className="why-actions">
                <Mag className="btn btn-primary" href="#estimate">
                  Рассчитать проект <ArrowRight size={16} />
                </Mag>
                <Mag className="btn btn-glass" href={author.telegram}>
                  Написать в Telegram <Send size={16} />
                </Mag>
                <Mag className="btn btn-glass" href="/desk">
                  Открыть рабочий стол <ArrowUpRight size={16} />
                </Mag>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <DealFlow />
            </Reveal>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-kicker">
            <div>
              <p className="eyebrow">Галерея</p>
              <h2>Пространства с характером</h2>
            </div>
            <span>Визуальные концепции</span>
          </div>
          <div className="project-grid">
            {rooms.map((r, i) => (
              <button key={r.name} className={`project-item project-${i}`} onClick={() => showRoom(i)}>
                <Tilt>
                  <div className="project-photo spot" onMouseMove={spotMove}>
                    <img src={r.image} alt={r.text} loading="lazy" decoding="async" width={1707} height={1280} />
                    <span className="project-arrow">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                </Tilt>
                <div className="project-label">
                  <h3>{r.name}</h3>
                  <span>{r.type}</span>
                </div>
              </button>
            ))}
          </div>
          <p className="project-disclaimer">
            Учебный бренд. Изображения интерьеров используются как референсы, а не как выполненные заказы.
          </p>
        </section>

        <section id="approach" className="section approach" data-track="view">
          <div className="approach-grid section-narrow">
            <Reveal>
              <p className="eyebrow">Процесс</p>
              <h2>
                От первого разговора
                <br />
                до последнего штриха.
              </h2>
            </Reveal>
            <div className="approach-steps">
              <article>
                <em>01</em>
                <div>
                  <h3>Знакомимся</h3>
                  <p>Обсуждаем привычки, пожелания и бюджет. Находим точку, с которой начинается ваш дом.</p>
                </div>
              </article>
              <article>
                <em>02</em>
                <div>
                  <h3>Проектируем</h3>
                  <p>Собираем планировку, материалы и свет в цельное пространство — без лишнего шума.</p>
                </div>
              </article>
              <article>
                <em>03</em>
                <div>
                  <h3>Воплощаем</h3>
                  <p>Готовим рабочие чертежи и план действий, чтобы идеи стали понятными решениями.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="packages" className="section">
          <Reveal className="packages-head">
            <p className="eyebrow">Оффер</p>
            <h2>
              Три глубины.
              <br />
              Одна <em>ясная цена.</em>
            </h2>
            <p>Выберите, насколько близко мы ведём проект — ориентир появится сразу, без звонка менеджера.</p>
          </Reveal>
          <div className="pack-grid">
            {packages.map((p, i) => (
              <button
                key={p.id}
                className={pack === i ? 'pack-card spot is-on' : 'pack-card spot'}
                onMouseMove={spotMove}
                onClick={() => goEstimate(i)}
              >
                {p.id === 'full' && <span className="pack-badge">Чаще выбирают</span>}
                <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.name}</h3>
                <p>{p.detail}</p>
                <ul className="pack-includes">
                  {p.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <strong>{money(p.rate)} ₽/м²</strong>
              </button>
            ))}
          </div>
        </section>

        <section id="estimate" className="section estimate" ref={estimateRef}>
          <div className="estimate-copy">
            <p className="eyebrow">Конверсия</p>
            <h2>
              Давайте придадим
              <br />
              <em>идеям форму.</em>
            </h2>
            <p>Узнайте ориентировочную стоимость дизайна вашего пространства — и сохраните заявку в рабочий стол студии.</p>
            <ul>
              <li>
                <Sparkles size={16} /> Ориентир за полминуты: площадь × пакет
              </li>
              <li>
                <Check size={16} /> Заявка сразу попадает в демо-CRM «ПОТОК»
              </li>
              <li>
                <Check size={16} /> Без звонков и внешней отправки — всё локально
              </li>
            </ul>
            <p className="estimate-note">Демонстрационный расчёт. Ставки условные, не являются предложением реальной студии.</p>
            <div className="why-actions">
              <Mag className="btn btn-glass" href={author.telegram}>
                Написать автору <Send size={16} />
              </Mag>
              <Mag className="btn btn-glass" href="/desk">
                Открыть CRM <ArrowUpRight size={16} />
              </Mag>
            </div>
          </div>
          <div className="workspace">
            <div className="step-indicator">
              <span className={step === 1 ? 'active' : ''}>01 / Пространство</span>
              <span className={step === 2 ? 'active' : ''}>02 / Знакомство</span>
              <span className={step === 3 ? 'active' : ''}>03 / Готово</span>
            </div>
            {step === 1 ? (
              <div>
                <label className="area-label" htmlFor="area">
                  Площадь пространства
                  <span>
                    <input
                      id="area"
                      type="number"
                      min={20}
                      max={500}
                      inputMode="numeric"
                      value={Number.isFinite(area) ? area : ''}
                      aria-invalid={!valid}
                      aria-describedby="area-hint"
                      onChange={(e) => setArea(e.target.value === '' ? Number.NaN : Number(e.target.value))}
                    />{' '}
                    м²
                  </span>
                </label>
                <p id="area-hint" className={valid ? 'field-hint' : 'field-hint is-error'} role={valid ? undefined : 'status'}>
                  {valid ? 'От 20 до 500 м²' : 'Укажите площадь от 20 до 500 м²'}
                </p>
                <input
                  className="area-slider"
                  type="range"
                  min={20}
                  max={500}
                  value={sliderArea}
                  aria-label="Площадь ползунок"
                  style={{ ['--p' as string]: `${((sliderArea - 20) / 480) * 100}%` }}
                  onChange={(e) => setArea(Number(e.target.value))}
                />
                <div className="range-label">
                  <span>20 м²</span>
                  <span>500 м²</span>
                </div>
                <fieldset className="packages">
                  <legend>Насколько глубоко погружаемся?</legend>
                  {packages.map((p, i) => (
                    <label key={p.id} className={pack === i ? 'package selected' : 'package'}>
                      <input type="radio" name="package" checked={pack === i} onChange={() => setPack(i)} />
                      <div>
                        <strong>{p.name}</strong>
                        <p>{p.detail}</p>
                      </div>
                      <span>{money(p.rate)} ₽/м²</span>
                    </label>
                  ))}
                </fieldset>
                <div className="estimate-total">
                  <span>Ориентир по стоимости</span>
                  <strong>{valid ? `${money(shown)} ₽` : 'Укажите 20–500 м²'}</strong>
                </div>
                <Mag className="btn btn-primary btn-block" disabled={!valid} onClick={() => setStep(2)}>
                  Продолжить <ArrowRight size={18} />
                </Mag>
              </div>
            ) : step === 2 ? (
              <form onSubmit={submit} className="enquiry-form">
                <h3>Расскажите о себе</h3>
                <p>
                  {area} м² · {packages[pack].name} · {money(area * packages[pack].rate)} ₽
                </p>
                <label>
                  Ваше имя
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Например, Тестовый клиент"
                    autoComplete="off"
                    aria-invalid={Boolean(fieldError.name)}
                    aria-describedby={fieldError.name ? 'name-error' : undefined}
                    onChange={() => setFieldError((e) => ({ ...e, name: undefined }))}
                  />
                </label>
                {fieldError.name && (
                  <p id="name-error" className="form-error" role="alert">
                    {fieldError.name}
                  </p>
                )}
                <label>
                  Телефон или email
                  <input
                    name="contact"
                    required
                    minLength={5}
                    maxLength={150}
                    placeholder="demo@example.com"
                    autoComplete="off"
                    inputMode="email"
                    aria-invalid={Boolean(fieldError.contact)}
                    aria-describedby={fieldError.contact ? 'contact-error' : 'contact-hint'}
                    onChange={() => setFieldError((e) => ({ ...e, contact: undefined }))}
                  />
                </label>
                <p id="contact-hint" className="field-hint">
                  Демо-контакт: цифры телефона или email со знаком @.
                </p>
                {fieldError.contact && (
                  <p id="contact-error" className="form-error" role="alert">
                    {fieldError.contact}
                  </p>
                )}
                <label>
                  Что важно в вашем пространстве?
                  <textarea name="note" maxLength={2000} rows={3} placeholder="Светлая кухня, место для работы, больше воздуха…" />
                </label>
                <label className="demo-consent">
                  <input type="checkbox" required />
                  Я использую вымышленные данные. Заявка сохранится в локальной демоверсии.
                </label>
                {error && (
                  <p role="alert" className="form-error">
                    {error}
                  </p>
                )}
                <Mag className="btn btn-primary btn-block" type="submit" disabled={pending}>
                  {pending ? 'Сохраняем…' : 'Сохранить демозаявку'}
                  <ArrowUpRight size={18} />
                </Mag>
                <button type="button" className="back-button" onClick={() => setStep(1)} disabled={pending}>
                  <ArrowLeft size={16} /> Вернуться к расчёту
                </button>
              </form>
            ) : (
              <div className="enquiry-success" role="status">
                <span className="success-check">
                  <Check size={28} />
                </span>
                <h3>Первый шаг сделан.</h3>
                <p>Демозаявка сохранена. Откройте «ПОТОК», чтобы увидеть её и пройти путь от первого обращения до сделки.</p>
                <span className="receipt">Заявка {saved.slice(0, 8)}</span>
                <Mag className="btn btn-primary btn-block" href="/desk">
                  Открыть заявку в CRM <ArrowUpRight size={18} />
                </Mag>
                <Mag className="btn btn-glass btn-block" href={author.telegram}>
                  Написать в Telegram <Send size={16} />
                </Mag>
                <button className="back-button" onClick={() => { setStep(1); setSaved(''); }}>
                  Начать новый расчёт
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="section">
          <div className="system">
            <article className="system-card">
              <span className="orb orb-b" />
              <p className="eyebrow">FORMA</p>
              <h3>Сайт, который приводит заявку.</h3>
              <p>Герой, оффер и живой расчёт собраны так, чтобы человек не думал, куда нажать — только о доме.</p>
              <div className="why-actions">
                <Mag className="btn btn-glass" href="#estimate">
                  К расчёту <ArrowRight size={16} />
                </Mag>
                <Mag className="btn btn-glass" href={author.telegram}>
                  Связь <Send size={16} />
                </Mag>
              </div>
            </article>
            <article className="system-card accent">
              <span className="orb orb-a" />
              <p className="eyebrow">ПОТОК</p>
              <h3>CRM, которая ведёт до сделки.</h3>
              <p>Заявка не теряется в мессенджере: этапы, заметки, экспорт. Второй проект того же портфолио.</p>
              <Mag className="btn btn-dark" href="/desk">
                Открыть рабочий стол <ArrowUpRight size={16} />
              </Mag>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="faq">
            <div className="faq-head">
              <p className="eyebrow">Возражения</p>
              <h2>Коротко и честно</h2>
            </div>
            {faq.map((item, i) => (
              <div key={item.q} className={faqOpen === i ? 'faq-item is-open' : 'faq-item'}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                  aria-expanded={faqOpen === i}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-btn-${i}`}
                >
                  {item.q}
                  <Plus size={18} />
                </button>
                <div className="faq-body" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <blockquote className="quote-band" data-track="view">
          <p>Дом должен работать на вас, а не наоборот.</p>
          <cite>Манифест FORMA</cite>
        </blockquote>

        <section className="close-band" data-track="view" aria-label="Начать проект">
          <img src={rooms[2].image} className="close-img" alt="" loading="lazy" decoding="async" width={1800} height={1200} />
          <div className="close-shade" />
          <div className="close-copy">
            <p className="eyebrow">Следующий шаг</p>
            <h2>
              Готовы придать
              <br />
              <em>идеям форму?</em>
            </h2>
            <p>Ориентир за полминуты. Заявка останется в студии — без звонков.</p>
            <div className="hero-actions">
              <Mag className="btn btn-primary" href="#estimate">
                Рассчитать проект <ArrowUpRight size={18} />
              </Mag>
              <Mag className="btn btn-glass" href={author.telegram}>
                Написать в Telegram <ArrowUpRight size={18} />
              </Mag>
            </div>
            <p className="close-author">
              Почта:{' '}
              <a href={authorMailto}>{author.email}</a>
              {' · '}
              <Link href="/desk">демо-CRM ПОТОК</Link>
            </p>
          </div>
        </section>
      </main>

      <footer className="studio-footer" inert={menu ? true : undefined}>
        <div>
          <Link href="/" className="footer-brand" aria-label="FORMA">
            <BrandMark size={36} />
            <span>FORMA</span>
          </Link>
          <p>Пространство начинается с вас.</p>
        </div>
        <div className="footer-links">
          <a href="#projects">Пространства</a>
          <a href="#estimate">Расчёт проекта</a>
          <Link href="/desk">ПОТОК — второй проект</Link>
        </div>
        <div className="footer-contact">
          <AuthorContact />
          <p className="footer-note">
            Демонстрационный проект · 2027
            <br />
            Демозаявки остаются на сайте
          </p>
        </div>
      </footer>

      <a className={sticky ? 'btn btn-primary sticky-cta' : 'btn btn-primary sticky-cta is-hidden'} href="#estimate" inert={menu ? true : undefined}>
        <span className="btn-inner">
          Рассчитать проект <ArrowUpRight size={16} />
        </span>
      </a>
      <button
        type="button"
        className={toTop && !menu ? 'to-top is-on' : 'to-top'}
        aria-label="Наверх"
        onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })}
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
