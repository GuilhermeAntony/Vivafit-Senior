import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, SENIOR_SIZES } from '../../styles/designTokens';

type CardVariant = 'default' | 'senior';

type CardProps = ViewProps & {
  variant?: CardVariant;
};

const getCardStyles = (variant: CardVariant): ViewStyle => {
  switch (variant) {
    case 'senior':
      return {
        backgroundColor: COLORS.card,
        ...SENIOR_SIZES.card,
        borderWidth: 1,
        borderColor: COLORS.border,
      };
    default:
      return {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
      };
  }
};

export const Card = ({ children, style, variant = 'default', ...rest }: CardProps) => {
  const cardStyles = getCardStyles(variant);
  
  return (
    <View {...rest} style={[cardStyles, style as any]}>
      {children}
    </View>
  );
};

export const CardHeader = ({ children, style, ...rest }: ViewProps) => (
  <View {...rest} style={[
    {
      marginBottom: SPACING.lg,
      paddingBottom: SPACING.md,
    }, 
    style as any
  ]}>
    {children}
  </View>
);

export const CardContent = ({ children, style, ...rest }: ViewProps) => (
  <View {...rest} style={[
    {
      flex: 1,
    }, 
    style as any
  ]}>
    {children}
  </View>
);

export const CardTitle = ({ children, style, ...rest }: ViewProps) => (
  <View {...rest} style={[
    {
      marginBottom: SPACING.sm,
    }, 
    style as any
  ]}>
    {children}
  </View>
);

export const CardFooter = ({ children, style, ...rest }: ViewProps) => (
  <View {...rest} style={[
    {
      marginTop: SPACING.lg,
      paddingTop: SPACING.md,
    }, 
    style as any
  ]}>
    {children}
  </View>
);

export default Card;
