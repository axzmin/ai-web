'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: '#1a1614',
          colorInputBackground: '#2a2520',
          colorInputText: '#F5F0E6',
          colorText: '#F5F0E6',
          colorTextSecondary: '#8a8279',
          colorPrimary: '#FF8C42',
          borderRadius: '8px',
          fontFamily: 'Geist, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        },
        elements: {
          card: {
            background: '#2a2520',
            border: '1px solid rgba(26, 22, 20, 0.1)',
            boxShadow: 'none',
          },
          headerTitle: {
            color: '#F5F0E6',
          },
          headerSubtitle: {
            color: '#8a8279',
          },
          formButtonPrimary: {
            background: 'linear-gradient(135deg, #FF8C42, #FF6B1A)',
            boxShadow: '0 4px 15px rgba(255, 140, 66, 0.3)',
          },
          socialButtonsBlockButton: {
            background: '#2a2520',
            border: '1px solid rgba(255, 140, 66, 0.2)',
          },
          dividerLine: {
            background: 'rgba(26, 22, 20, 0.2)',
          },
          dividerText: {
            color: '#8a8279',
          },
          formFieldInput: {
            background: '#2a2520',
            border: '1px solid rgba(26, 22, 20, 0.1)',
            color: '#F5F0E6',
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
