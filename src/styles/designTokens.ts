import { Dimensions, PixelRatio } from 'react-native';

// Screen dimensions and design tokens
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const pixelRatio = PixelRatio.get();

// Design tokens following the reference repository
export const COLORS = {
  // Primary colors (using HSL from reference repository)
  primary: '#22C55E', // hsl(142, 71%, 45%) - Green primary
  primaryForeground: '#FFFFFF', // hsl(0, 0%, 100%)
  primaryHover: '#16A34A', // hsl(142, 71%, 40%)
  
  // Secondary colors (Blue for menu buttons)
  secondary: '#3B82F6', // hsl(210, 98%, 60%)
  secondaryForeground: '#FFFFFF', // hsl(0, 0%, 100%)
  secondaryHover: '#2563EB', // hsl(210, 98%, 55%)
  
  // Background and surface colors
  background: '#FAFAFA', // hsl(0, 0%, 98%)
  foreground: '#374151', // hsl(215, 25%, 27%)
  card: '#FFFFFF', // hsl(0, 0%, 100%)
  cardForeground: '#374151', // hsl(215, 25%, 27%)
  
  // Muted colors
  muted: '#E5E7EB', // hsl(220, 13%, 91%)
  mutedForeground: '#6B7280', // hsl(215.4, 16.3%, 46.9%)
  
  // Accent colors
  accent: '#22C55E', // hsl(142, 71%, 45%)
  accentForeground: '#FFFFFF', // hsl(0, 0%, 100%)
  
  // Status colors for seniors
  success: '#22C55E', // hsl(142, 71%, 45%)
  successForeground: '#FFFFFF', // hsl(0, 0%, 100%)
  warning: '#F59E0B', // hsl(45, 93%, 58%)
  warningForeground: '#000000', // hsl(0, 0%, 0%)
  info: '#3B82F6', // hsl(210, 98%, 60%)
  infoForeground: '#FFFFFF', // hsl(0, 0%, 100%)
  destructive: '#EF4444', // hsl(0, 84%, 55%)
  destructiveForeground: '#FFFFFF', // hsl(0, 0%, 100%)
  
  // Border colors
  border: '#E5E7EB', // hsl(220, 13%, 91%)
  input: '#E5E7EB', // hsl(220, 13%, 91%)
  ring: '#22C55E', // hsl(142, 71%, 45%)
};

// Typography following senior-friendly design
export const TYPOGRAPHY = {
  // Senior-friendly large text
  seniorTextLarge: {
    fontSize: 20,
    fontWeight: '500' as '500',
    lineHeight: 30, // relaxed line height
  },
  
  // Regular text sizes
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 36 },
  '4xl': { fontSize: 36, lineHeight: 40 },
};

// Spacing system
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
};

// Border radius
export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

// Shadow styles (mobile optimized)
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Senior-friendly component sizes (matching reference repository)
export const SENIOR_SIZES = {
  buttonLarge: {
    minHeight: 60,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS.xl,
  },
  inputLarge: {
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS.xl,
  },
  card: {
    padding: 32,
    borderRadius: BORDER_RADIUS['2xl'],
    ...SHADOWS.lg,
  },
};

// Layout constants
export const LAYOUT = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  headerHeight: 64,
  tabBarHeight: 80,
  containerPadding: SPACING.lg,
};

// Helper functions
export const getResponsiveSize = (size: number): number => {
  if (LAYOUT.isSmallDevice) {
    return size * 0.9; // Reduce size by 10% on small devices
  }
  return size;
};

export const getPixelSize = (size: number): number => {
  return Math.round(PixelRatio.roundToNearestPixel(size));
};