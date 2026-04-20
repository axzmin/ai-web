'use client';

import { ClerkProvider } from '@clerk/nextjs';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          // Background & Surface
          colorBackground: '#1a1614',
          colorInputBackground: '#252220',
          colorShimmer: '#3a3530',

          // Text - ensure high contrast on dark bg
          colorText: '#F5F0E6',
          colorTextOnPrimaryBackground: '#F5F0E6',
          colorTextSecondary: '#a09890',

          // Primary accent
          colorPrimary: '#FF8C42',
          colorPrimaryHover: '#FF7A2E',
          colorPrimaryBackground: '#2a2018',

          // Danger / Error
          colorDanger: '#ff6b6b',

          // Borders & Inputs
          borderRadius: '10px',
          inputBorderRadius: '8px',

          // Fonts
          fontFamily: 'Geist, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
          fontFamilyButtons: 'Geist, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',

          // Shadows
          shadowNone: 'none',

          // Spacing
          paddingCircleButton: '12px',
          gapBetweenPages: '32px',
        },
        elements: {
          // Main card
          card: {
            background: '#1e1a17',
            border: '1px solid rgba(255, 140, 66, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          },

          // Header
          headerTitle: {
            color: '#F5F0E6',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
          headerSubtitle: {
            color: '#a09890',
            fontSize: '14px',
          },

          // Social buttons
          socialButtonsBlockButton: {
            background: '#252220',
            border: '1px solid rgba(255, 140, 66, 0.2)',
            color: '#F5F0E6',
            fontSize: '14px',
            fontWeight: 500,
          },
          socialButtonsBlockButtonText: {
            color: '#F5F0E6',
          },

          // Divider
          dividerLine: {
            background: 'rgba(255, 140, 66, 0.15)',
          },
          dividerText: {
            color: '#a09890',
            fontSize: '13px',
          },

          // Form
          formButtonPrimary: {
            background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B1A 100%)',
            boxShadow: '0 4px 15px rgba(255, 140, 66, 0.25)',
            fontSize: '15px',
            fontWeight: 600,
            border: 'none',
            padding: '12px 24px',
          },
          formButtonSecondary: {
            background: '#252220',
            border: '1px solid rgba(255, 140, 66, 0.2)',
            color: '#F5F0E6',
            fontSize: '14px',
            fontWeight: 500,
          },

          // Inputs
          formFieldInput: {
            background: '#252220',
            border: '1px solid rgba(255, 140, 66, 0.15)',
            color: '#F5F0E6',
            fontSize: '15px',
            padding: '12px 14px',
          },
          formFieldInput__invalid: {
            border: '1px solid rgba(255, 107, 107, 0.5)',
          },
          formFieldLabel: {
            color: '#a09890',
            fontSize: '13px',
            fontWeight: 500,
          },
          formFieldError: {
            color: '#ff6b6b',
            fontSize: '12px',
          },
          formFieldHintText: {
            color: '#8a8279',
            fontSize: '12px',
          },

          // Identity preview
          identityPreviewText: {
            color: '#F5F0E6',
            fontSize: '14px',
          },
          identityPreviewEditButton: {
            color: '#FF8C42',
          },

          // Footer
          footer: {
            background: 'transparent',
          },
          footerActionLink: {
            color: '#FF8C42',
            fontWeight: 500,
          },

          // Logo
          logoImage: {
            display: 'none',
          },
          logoBox: {
            background: 'linear-gradient(135deg, #FF8C42, #FF6B1A)',
            borderRadius: '10px',
            padding: '10px',
          },

          // Alternative methods
          alternativeMethodsBlockButton: {
            color: '#FF8C42',
            fontSize: '14px',
            fontWeight: 500,
          },

          // Otp
          otpCodeFieldInput: {
            background: '#252220',
            border: '1px solid rgba(255, 140, 66, 0.15)',
            color: '#F5F0E6',
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
