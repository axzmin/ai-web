'use client';

import { ClerkProvider } from '@clerk/nextjs';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          // Background & Surface — warm beige theme to match website
          colorBackground: '#F5F0E6',
          colorInputBackground: '#ffffff',
          colorShimmer: '#e8e0d0',

          // Text — dark warm tones for contrast on light bg
          colorText: '#2D2418',
          colorTextOnPrimaryBackground: '#ffffff',
          colorTextSecondary: '#7A6555',
          colorTextTertiary: '#A08060',

          // Primary accent — warm orange
          colorPrimary: '#FF8C42',
          colorPrimaryHover: '#E67A35',
          colorPrimaryBackground: '#FFF0E6',

          // Danger / Error
          colorDanger: '#DC4545',
          colorDangerBackground: '#FEF2F2',

          // Success
          colorSuccess: '#2D8B4E',
          colorSuccessBackground: '#F0FDF4',

          // Borders & Inputs
          borderRadius: '12px',
          inputBorderRadius: '10px',

          // Fonts
          fontFamily: 'Geist, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
          fontFamilyButtons: 'Geist, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',

          // Shadows — soft, warm
          shadowScreens: '0 8px 40px rgba(45, 36, 24, 0.12)',
          shadowScales: '0 4px 20px rgba(45, 36, 24, 0.08)',
          shadowButtons: '0 2px 8px rgba(255, 140, 66, 0.20)',

          // Spacing
          paddingCircleButton: '12px',
          gapBetweenPages: '32px',
        },
        elements: {
          // Main card — light with warm border
          card: {
            background: '#FFFFFF',
            border: '1px solid rgba(255, 140, 66, 0.20)',
            boxShadow: '0 8px 40px rgba(45, 36, 24, 0.10)',
            borderRadius: '16px',
          },

          // Header
          headerTitle: {
            color: '#2D2418',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
          headerSubtitle: {
            color: '#7A6555',
            fontSize: '14px',
          },

          // Social buttons
          socialButtonsBlockButton: {
            background: '#FFFFFF',
            border: '1px solid rgba(255, 140, 66, 0.25)',
            color: '#2D2418',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(45, 36, 24, 0.06)',
          },
          socialButtonsBlockButtonText: {
            color: '#2D2418',
          },
          socialButtonsBlockButtonHover: {
            background: '#FFF8F3',
            border: '1px solid rgba(255, 140, 66, 0.35)',
          },

          // Divider
          dividerLine: {
            background: 'rgba(255, 140, 66, 0.20)',
          },
          dividerText: {
            color: '#7A6555',
            fontSize: '13px',
          },

          // Form — Primary CTA button
          formButtonPrimary: {
            background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B1A 100%)',
            boxShadow: '0 4px 15px rgba(255, 140, 66, 0.30)',
            fontSize: '15px',
            fontWeight: 600,
            border: 'none',
            padding: '13px 24px',
            borderRadius: '10px',
            color: '#ffffff',
          },
          formButtonPrimaryHover: {
            background: 'linear-gradient(135deg, #E67A35 0%, #E55A10 100%)',
            boxShadow: '0 4px 20px rgba(255, 140, 66, 0.40)',
          },
          formButtonSecondary: {
            background: '#FFFFFF',
            border: '1px solid rgba(255, 140, 66, 0.25)',
            color: '#2D2418',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(45, 36, 24, 0.06)',
          },

          // Inputs
          formFieldInput: {
            background: '#FFFFFF',
            border: '1px solid rgba(255, 140, 66, 0.25)',
            color: '#2D2418',
            fontSize: '15px',
            padding: '12px 14px',
            borderRadius: '10px',
          },
          formFieldInput__invalid: {
            border: '1px solid rgba(220, 69, 69, 0.50)',
            background: '#FEF9F9',
          },
          formFieldInputFocus: {
            border: '1px solid rgba(255, 140, 66, 0.60)',
            boxShadow: '0 0 0 3px rgba(255, 140, 66, 0.12)',
          },
          formFieldLabel: {
            color: '#7A6555',
            fontSize: '13px',
            fontWeight: 500,
          },
          formFieldError: {
            color: '#DC4545',
            fontSize: '12px',
          },
          formFieldHintText: {
            color: '#A08060',
            fontSize: '12px',
          },

          // Identity preview
          identityPreviewText: {
            color: '#2D2418',
            fontSize: '14px',
          },
          identityPreviewEditButton: {
            color: '#FF8C42',
          },

          // Footer
          footer: {
            background: '#000000',
          },
          footerActionLink: {
            color: '#FF8C42',
            fontWeight: 500,
            fontSize: '14px',
          },
          footerRequiredSymbol: {
            color: '#FF8C42',
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
            background: '#FFFFFF',
            border: '1px solid rgba(255, 140, 66, 0.25)',
            color: '#2D2418',
            borderRadius: '10px',
          },

          // Modal / Popup — warm overlay
          modalContent: {
            background: '#FFFFFF',
            borderRadius: '16px',
          },
          modalBackdrop: {
            background: 'rgba(45, 36, 24, 0.45)',
            backdropFilter: 'blur(4px)',
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
