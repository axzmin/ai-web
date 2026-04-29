'use client';

import { ClerkProvider } from '@clerk/nextjs';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          // Background & Surface — warm beige theme to match website
          colorBackground: '#f5f1ee',
          colorInputBackground: '#ffffff',
          colorShimmer: '#e8e0d0',

          // Text — dark warm tones for contrast on light bg
          colorText: '#2D2418',
          colorTextOnPrimaryBackground: '#ffffff',
          colorTextSecondary: '#7A6555',
          colorTextTertiary: '#A08060',

          // Primary accent — teal
          colorPrimary: '#34625b',
          colorPrimaryHover: '#2a4f49',
          colorPrimaryBackground: '#E8F0EF',

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
          shadowButtons: '0 2px 8px rgba(52, 98, 91, 0.20)',

          // Spacing
          paddingCircleButton: '12px',
          gapBetweenPages: '32px',
        },
        elements: {
          // Main card — light with teal border
          card: {
            background: '#FFFFFF',
            border: '1px solid rgba(52, 98, 91, 0.20)',
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
            border: '1px solid rgba(52, 98, 91, 0.25)',
            color: '#2D2418',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(45, 36, 24, 0.06)',
          },
          socialButtonsBlockButtonText: {
            color: '#2D2418',
          },
          socialButtonsBlockButtonHover: {
            background: '#F0F8F7',
            border: '1px solid rgba(52, 98, 91, 0.35)',
          },

          // Divider
          dividerLine: {
            background: 'rgba(52, 98, 91, 0.20)',
          },
          dividerText: {
            color: '#7A6555',
            fontSize: '13px',
          },

          // Form — Primary CTA button
          formButtonPrimary: {
            background: 'linear-gradient(135deg, #34625b 0%, #1e4a42 100%)',
            boxShadow: '0 4px 15px rgba(52, 98, 91, 0.30)',
            fontSize: '15px',
            fontWeight: 600,
            border: 'none',
            padding: '13px 24px',
            borderRadius: '10px',
            color: '#ffffff',
          },
          formButtonPrimaryHover: {
            background: 'linear-gradient(135deg, #2a4f49 0%, #163832 100%)',
            boxShadow: '0 4px 20px rgba(52, 98, 91, 0.40)',
          },
          formButtonSecondary: {
            background: '#FFFFFF',
            border: '1px solid rgba(52, 98, 91, 0.25)',
            color: '#2D2418',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(45, 36, 24, 0.06)',
          },

          // Inputs
          formFieldInput: {
            background: '#FFFFFF',
            border: '1px solid rgba(52, 98, 91, 0.25)',
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
            border: '1px solid rgba(52, 98, 91, 0.60)',
            boxShadow: '0 0 0 3px rgba(52, 98, 91, 0.12)',
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
            color: '#34625b',
          },

          // Footer
          footer: {
            background: 'transparent',
          },
          footerActionLink: {
            color: '#34625b',
            fontWeight: 500,
            fontSize: '14px',
          },
          footerRequiredSymbol: {
            color: '#34625b',
          },

          // Logo
          logoImage: {
            display: 'none',
          },
          logoBox: {
            background: 'linear-gradient(135deg, #34625b, #1e4a42)',
            borderRadius: '10px',
            padding: '10px',
          },

          // Alternative methods
          alternativeMethodsBlockButton: {
            color: '#34625b',
            fontSize: '14px',
            fontWeight: 500,
          },

          // Otp
          otpCodeFieldInput: {
            background: '#FFFFFF',
            border: '1px solid rgba(52, 98, 91, 0.25)',
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
