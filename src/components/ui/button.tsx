import React from 'react';
import { TouchableOpacity, Text as RNText, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SENIOR_SIZES, BORDER_RADIUS, SPACING } from '../../styles/designTokens';

type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg' | 'senior';

type Props = TouchableOpacityProps & { 
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const getButtonStyles = (variant: ButtonVariant, size: ButtonSize, disabled?: boolean) => {
  let backgroundColor = COLORS.primary;
  let textColor = COLORS.primaryForeground;
  let borderColor = 'transparent';
  let borderWidth = 0;

  // Handle variants
  switch (variant) {
    case 'secondary':
      backgroundColor = COLORS.secondary;
      textColor = COLORS.secondaryForeground;
      break;
    case 'destructive':
      backgroundColor = COLORS.destructive;
      textColor = COLORS.destructiveForeground;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      textColor = COLORS.foreground;
      borderColor = COLORS.border;
      borderWidth = 1;
      break;
    case 'ghost':
      backgroundColor = 'transparent';
      textColor = COLORS.foreground;
      break;
    default:
      // default case already set above
      break;
  }

  // Handle sizes
  let padding = SPACING.md;
  let minHeight = 44;
  let borderRadius = BORDER_RADIUS.md;
  let fontSize = TYPOGRAPHY.base.fontSize;
  let fontWeight: TextStyle['fontWeight'] = '600';

  switch (size) {
    case 'sm':
      padding = SPACING.sm;
      minHeight = 36;
      fontSize = TYPOGRAPHY.sm.fontSize;
      break;
    case 'lg':
      padding = SPACING.lg;
      minHeight = 52;
      fontSize = TYPOGRAPHY.lg.fontSize;
      break;
    case 'senior':
      padding = SENIOR_SIZES.buttonLarge.paddingHorizontal;
      minHeight = SENIOR_SIZES.buttonLarge.minHeight;
      borderRadius = SENIOR_SIZES.buttonLarge.borderRadius;
      fontSize = TYPOGRAPHY.seniorTextLarge.fontSize;
      fontWeight = TYPOGRAPHY.seniorTextLarge.fontWeight;
      break;
  }

  const buttonStyle: ViewStyle = {
    backgroundColor: disabled ? COLORS.muted : backgroundColor,
    paddingHorizontal: padding,
    paddingVertical: size === 'senior' ? SENIOR_SIZES.buttonLarge.paddingVertical : SPACING.sm,
    borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight,
    borderWidth,
    borderColor: disabled ? COLORS.muted : borderColor,
    opacity: disabled ? 0.6 : 1,
  };

  const textStyle: TextStyle = {
    color: disabled ? COLORS.mutedForeground : textColor,
    fontSize,
    fontWeight,
    textAlign: 'center',
  };

  return { buttonStyle, textStyle };
};

export const Button = ({ children, style, variant = 'default', size = 'default', disabled, ...rest }: Props) => {
  const { buttonStyle, textStyle } = getButtonStyles(variant, size, disabled);

  return (
    <TouchableOpacity 
      {...rest} 
      style={[buttonStyle, style as any]}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <RNText style={textStyle}>{children as any}</RNText>
    </TouchableOpacity>
  );
};

export default Button;
