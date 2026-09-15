import type { Metadata } from 'next';
import Desk from './Desk';

export const metadata: Metadata = {
  title: 'ПОТОК — демо CRM студии',
  description: 'Демонстрационный рабочий стол заявок FORMA. Учебные данные, не боевая CRM.',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: '/desk' },
};

export default function Page() {
  return <Desk />;
}
