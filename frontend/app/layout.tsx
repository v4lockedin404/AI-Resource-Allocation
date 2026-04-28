import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'AI Resource Allocation — Smart Volunteer Coordinator',
  description: 'AI-powered NGO platform for intelligent volunteer matching and field report digitization using Gemini AI.',
  keywords: ['NGO', 'volunteer coordination', 'AI matching', 'disaster response', 'Gemini AI'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111827',
              color: '#F9FAFB',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#111827' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#111827' },
            },
          }}
        />
      </body>
    </html>
  );
}
