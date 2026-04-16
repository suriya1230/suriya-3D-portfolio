// app/layout.js
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Suriya | AI Animated Portfolio',
  description: 'The cinematic AI-powered portfolio of Suriya — engineer, creator, visionary.',
  openGraph: {
    title: 'Suriya AI Portfolio',
    description: 'Experience portfolio like never before — 3D cinematic, AI-driven.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="noise-overlay">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(10,10,15,0.95)',
              color: '#e8e8e8',
              border: '1px solid rgba(201,168,76,0.3)',
              fontFamily: 'var(--font-body)',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
