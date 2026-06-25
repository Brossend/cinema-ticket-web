import { QueryProvider } from '@/app/_providers';

import '../_styles/globals.scss';

type RootLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="ru">
        <body>
        <QueryProvider>{children}</QueryProvider>
        </body>
        </html>
    );
}