import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from './brand';

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <BrandMark size={40} />
        <p className="eyebrow" style={{ justifyContent: 'center', marginTop: 28 }}>
          404
        </p>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(40px, 8vw, 72px)', lineHeight: 0.95, margin: '12px 0 16px' }}>
          Такой страницы нет.
        </h1>
        <p style={{ color: 'var(--fg-dim)', marginBottom: 28 }}>Вернитесь в студию — расчёт и демо-CRM на месте.</p>
        <Link href="/" className="btn btn-primary">
          <span className="btn-inner">На главную</span>
        </Link>
      </div>
    </main>
  );
}
