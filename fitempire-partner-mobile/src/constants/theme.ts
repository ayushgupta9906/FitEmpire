/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111827',
    background: '#F9FAFB',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#F3F4F6',
    textSecondary: '#6B7280',
    primary: '#4F46E5',     // Indigo energetic
    primaryDark: '#4338CA',
    accent: '#10B981',      // Emerald green
    surface: '#FFFFFF',
    border: '#E5E7EB',
  },
  dark: {
    text: '#F9FAFB',
    background: '#0B0F19',  // Deep sleek dark
    backgroundElement: '#1A1F2C',
    backgroundSelected: '#2A303C',
    textSecondary: '#9CA3AF',
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    accent: '#34D399',
    surface: '#1A1F2C',
    border: '#374151',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
