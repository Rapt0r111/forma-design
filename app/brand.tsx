import Link from 'next/link';
import { author, authorMailto } from '@/lib/contact';

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="2" y="2" width="28" height="28" rx="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 23V9.5h10.5M11 16.2h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Brand({ href = '/', label = 'FORMA — главная' }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="brand" aria-label={label}>
      <BrandMark />
      <span className="brand-name">FORMA</span>
      <span className="brand-dot">®</span>
    </Link>
  );
}

export function AuthorContact({ compact = false }: { compact?: boolean }) {
  return (
    <address className={compact ? 'author-contact is-compact' : 'author-contact'}>
      <span>Автор концепта</span>
      <a href={author.telegram} target="_blank" rel="noopener noreferrer">
        Telegram · {author.telegramLabel}
      </a>
      <a href={authorMailto}>{author.email}</a>
    </address>
  );
}
