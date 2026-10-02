import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    primary: '#1A1A3E',
    primaryVariant: '#2D2D6E',
    secondary: '#4B4B9E',
    secondaryVariant: '#7070BE',
  },
  dark: {
    background: '#1E1E2E',
    surface: '#2E2E3E',
    primary: '#4B4B9E',
    primaryVariant: '#2D2D6E',
    secondary: '#7070BE',
    secondaryVariant: '#C3C3EA',
  },
};

const categoryColors = [
  '#FF6B6B', // Red - Food & Dining
  '#4ECDC4', // Teal - Transportation
  '#45B7D1', // Blue - Shopping
  '#FFA07A', // Orange - Entertainment
  '#98D8C8', // Green - Utilities
  '#F7DC6F', // Yellow - Health & Fitness
  '#BB8FCE', // Purple - Travel
  '#85C1E2', // Light Blue - Subscriptions
  '#52C4A3', // Mint - Work
  '#FFB6C1', // Pink - Personal
];

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.light.primary,
    secondary: colors.light.secondary,
    background: colors.light.background,
    surface: colors.light.surface,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.dark.primary,
    secondary: colors.dark.secondary,
    background: colors.dark.background,
    surface: colors.dark.surface,
  },
};

export const getThemeColors = (isDark: boolean) => {
  return isDark ? colors.dark : colors.light;
};

export const getCategoryColor = (index: number) => {
  return categoryColors[index % categoryColors.length];
};

export default lightTheme;
