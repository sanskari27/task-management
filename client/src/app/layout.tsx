import { BackgroundBeams } from '@/components/ui/background-beams';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={cn(inter.className, 'h-screen w-screen')}>
				<Providers>
					<div className='absolute top-3 right-3'>
						<ThemeToggle />
					</div>
					{children}
				</Providers>
				<BackgroundBeams />
			</body>
		</html>
	);
}
