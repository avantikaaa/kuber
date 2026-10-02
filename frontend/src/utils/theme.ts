import { extendTheme } from '@chakra-ui/react';

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

const theme = extendTheme({
  colors: {
    brand: {
      light: colors.light,
      dark: colors.dark,
    },
    category: categoryColors.reduce((acc, color, idx) => {
      acc[idx] = color;
      return acc;
    }, {} as Record<string, string>),
  },
  semanticTokens: {
    colors: {
      'bg-primary': {
        _light: colors.light.background,
        _dark: colors.dark.background,
      },
      'bg-secondary': {
        _light: colors.light.surface,
        _dark: colors.dark.surface,
      },
      'text-primary': {
        _light: colors.light.primary,
        _dark: colors.dark.secondary,
      },
      'border-color': {
        _light: '#E0E0E0',
        _dark: '#3E3E4E',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'md',
      },
      sizes: {
        md: {
          fontSize: ['sm', 'md'],
          px: [4, 6],
          py: [2, 3],
        },
        lg: {
          fontSize: ['md', 'lg'],
          px: [6, 8],
          py: [3, 4],
        },
      },
      variants: {
        solid: {
          bg: 'brand.light.primary',
          color: 'white',
          _dark: {
            bg: 'brand.dark.primary',
          },
          _hover: {
            opacity: 0.9,
          },
        },
        outline: {
          borderColor: 'brand.light.primary',
          color: 'brand.light.primary',
          _dark: {
            borderColor: 'brand.dark.primary',
            color: 'brand.dark.primary',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          fontSize: ['sm', 'md'],
          borderRadius: 'md',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'sm',
        },
      },
    },
  },
  fontSizes: {
    xs: ['11px', '16px'],
    sm: ['13px', '20px'],
    md: ['15px', '24px'],
    lg: ['17px', '28px'],
    xl: ['20px', '28px'],
    '2xl': ['24px', '32px'],
  },
  space: {
    0: '0',
    1: ['4px', '8px'],
    2: ['8px', '12px'],
    3: ['12px', '16px'],
    4: ['16px', '20px'],
    5: ['20px', '24px'],
    6: ['24px', '32px'],
    8: ['32px', '40px'],
  },
});

export const getThemeColors = (isDark: boolean) => {
  return isDark ? colors.dark : colors.light;
};

export const getCategoryColor = (index: number) => {
  return categoryColors[index % categoryColors.length];
};

export default theme;
