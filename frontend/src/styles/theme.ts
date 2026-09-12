/**
 * CarbonX Phase 4 Enterprise Design System Tokens
 */
export const themeColors = {
  primary: {
    50: '#ECFDF5',  // Mint Tint - Card highlight backgrounds, tag fills
    500: '#10B981', // Light Emerald - High-score indicators, accents
    600: '#059669', // Core Brand Emerald - Primary CTA, badges, checkmarks
    700: '#047857', // Brand Emerald - Primary button hover, active links
    900: '#064E3B', // Deep Emerald - Active headers, high-emphasis branding
  },
  secondary: {
    50: '#EFF6FF',  // Ice Blue Tint - Informational banners, filter pills
    600: '#2563EB', // Tech Blue - Data links, secondary CTAs, focus rings
    700: '#1D4ED8', // Deep Blue - Secondary action active, analytical charts
  },
  neutral: {
    50: '#F8FAFC',  // Slate 50 - Canvas background, inactive card surfaces
    100: '#F1F5F9', // Slate 100 - Table zebra rows, secondary button fills
    200: '#E2E8F0', // Slate 200 - Primary borders, dividers, subtle outlines
    400: '#94A3B8', // Slate 400 - Placeholder text, disabled icon fills
    600: '#475569', // Slate 600 - Secondary text, table headers, captions
    800: '#1E293B', // Slate 800 - Standard body text, card titles
    950: '#0F172A', // Slate 950 - Primary headings, extreme contrast text
  },
  success: {
    50: '#F0FDF4',
    600: '#16A34A',
  },
  warning: {
    50: '#FFFBEB',
    600: '#D97706',
  },
  error: {
    50: '#FEF2F2',
    600: '#DC2626',
  },
} as const;

export type ThemeColors = typeof themeColors;
