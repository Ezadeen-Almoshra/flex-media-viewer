import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import 'flex-media-viewer/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'flex-media-viewer — Next.js Example',
  description: 'App Router demo for flex-media-viewer',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
