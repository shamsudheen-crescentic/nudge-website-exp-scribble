import './globals.css';

export const metadata = {
  title: 'Nudge — stop overthinking, start doing',
  description: 'Stuck in your head? Nudge helps you break free from overthinking and actually do the thing.',
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Newsreader:ital,wght@0,500;1,500&family=Patrick+Hand&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
