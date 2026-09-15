import type { Metadata, Viewport } from 'next';
import { author } from '@/lib/contact';
import { siteUrl } from '@/lib/site';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#090a08',
  colorScheme: 'dark',
};

const title = 'FORMA × ПОТОК — концепт интерьерной студии и CRM';
const description =
  'Портфолио-демо: публичный расчёт дизайн-проекта FORMA и рабочий стол заявок ПОТОК. Учебный бренд, не оферта реальной студии.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: title, template: '%s · FORMA' },
  description,
  applicationName: 'FORMA',
  authors: [{ name: 'FORMA', url: author.telegram }],
  creator: 'FORMA',
  other: { 'contact:email': author.email },
  category: 'design',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'FORMA',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FORMA',
    alternateName: 'ПОТОК',
    url: siteUrl(),
    inLanguage: 'ru-RU',
    description,
    sameAs: [author.telegram],
    author: {
      '@type': 'Person',
      name: author.telegramLabel,
      url: author.telegram,
      email: author.email,
      sameAs: [author.telegram],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Это настоящая студия?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'FORMA — учебный бренд для портфолио. Интерьеры на фотографиях — референсы, не выполненные заказы. Заявка сохраняется только в демо-контуре. Написать автору: Telegram @Rapt0r111 или raptorfun111@gmail.com.',
        },
      },
      {
        '@type': 'Question',
        name: 'Как считается стоимость?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ориентир = площадь × ставка пакета. Ставки условные: концепция 2 500 ₽/м², дизайн-проект 4 500 ₽/м², полное ведение 6 000 ₽/м².',
        },
      },
      {
        '@type': 'Question',
        name: 'Что происходит с заявкой?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Она сразу появляется в демо-CRM «ПОТОК». Там можно сменить этап, добавить заметку и выгрузить CSV — без писем и звонков.',
        },
      },
      {
        '@type': 'Question',
        name: 'Как связаться с автором?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Telegram @Rapt0r111 или почта raptorfun111@gmail.com. Демозаявки на сайте никуда не уходят — это контур портфолио.',
        },
      },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="/fonts.css" />
        <link rel="preload" href="/cormorant-cyr.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/cormorant-lat.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/cormorant-cyr-italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/manrope-0.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/manrope-2.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/interior.webp" type="image/webp" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
