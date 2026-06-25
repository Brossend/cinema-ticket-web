import type { Metadata } from 'next';

import { RootLayout } from './layouts/root-layout';

export const metadata: Metadata = {
    title: 'Cinema Tickets',
    description: 'Сервис бронирования билетов в кино',
};

type LayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function NextRootLayout({ children }: LayoutProps) {
    return <RootLayout>{children}</RootLayout>;
}