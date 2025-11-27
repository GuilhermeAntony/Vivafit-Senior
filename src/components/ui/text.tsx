import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../styles/designTokens';
import { useFontSize } from '../../contexts/FontSizeContext';

type TextVariant = 
  | 'default'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'senior-large'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3';

type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: keyof typeof COLORS;
};

const getTextStyles = (variant: TextVariant, color?: keyof typeof COLORS): TextStyle => {
  let textStyle: TextStyle = {
    color: COLORS.foreground,
  };

  // Apply color if specified
  if (color && COLORS[color]) {
    textStyle.color = COLORS[color];
  }

  // Apply variant styles
  switch (variant) {
    case 'heading-1':
      return {
        ...textStyle,
        ...TYPOGRAPHY['4xl'],
        fontWeight: '700',
        color: textStyle.color,
      };
    case 'heading-2':
      return {
        ...textStyle,
        ...TYPOGRAPHY['3xl'],
        fontWeight: '700',
        color: textStyle.color,
      };
    case 'heading-3':
      return {
        ...textStyle,
        ...TYPOGRAPHY['2xl'],
        fontWeight: '600',
        color: textStyle.color,
      };
    case 'title':
      return {
        ...textStyle,
        ...TYPOGRAPHY.xl,
        fontWeight: '600',
        color: textStyle.color,
      };
    case 'subtitle':
      return {
        ...textStyle,
        ...TYPOGRAPHY.lg,
        fontWeight: '500',
        color: textStyle.color,
      };
    case 'body':
      return {
        ...textStyle,
        ...TYPOGRAPHY.base,
        fontWeight: '400',
        color: textStyle.color,
      };
    case 'caption':
      return {
        ...textStyle,
        ...TYPOGRAPHY.sm,
        fontWeight: '400',
        color: textStyle.color || COLORS.mutedForeground,
      };
    case 'senior-large':
      return {
        ...textStyle,
        ...TYPOGRAPHY.seniorTextLarge,
        color: textStyle.color,
      };
    default:
      return {
        ...textStyle,
        ...TYPOGRAPHY.base,
        fontWeight: '400',
        color: textStyle.color,
      };
  }
};

export const Text = ({ 
  children, 
  style, 
  variant = 'default', 
  color,
  ...rest 
}: TextProps) => {
  const { getFontSize } = useFontSize();
  const textStyles = getTextStyles(variant, color);
  
  // Aplicar preferência de tamanho de fonte
  const adjustedStyles = {
    ...textStyles,
    fontSize: textStyles.fontSize ? getFontSize(textStyles.fontSize) : textStyles.fontSize,
    lineHeight: textStyles.lineHeight ? getFontSize(textStyles.lineHeight) : textStyles.lineHeight,
  };

  return (
    <RNText {...rest} style={[adjustedStyles, style as any]}>
      {children}
    </RNText>
  );
};

export default Text;