import React from 'react';
import { TextInput, TextInputProps, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SENIOR_SIZES, BORDER_RADIUS, SPACING } from '../../styles/designTokens';

type InputSize = 'default' | 'sm' | 'lg' | 'senior';

type Props = TextInputProps & {
  size?: InputSize;
};

const getInputStyles = (size: InputSize): TextStyle => {
  let fontSize = TYPOGRAPHY.base.fontSize;
  let padding = SPACING.md;
  let minHeight = 44;
  let borderRadius = BORDER_RADIUS.md;

  switch (size) {
    case 'sm':
      fontSize = TYPOGRAPHY.sm.fontSize;
      padding = SPACING.sm;
      minHeight = 36;
      borderRadius = BORDER_RADIUS.sm;
      break;
    case 'lg':
      fontSize = TYPOGRAPHY.lg.fontSize;
      padding = SPACING.lg;
      minHeight = 52;
      borderRadius = BORDER_RADIUS.lg;
      break;
    case 'senior':
      fontSize = TYPOGRAPHY.seniorTextLarge.fontSize;
      padding = SENIOR_SIZES.inputLarge.paddingHorizontal;
      minHeight = SENIOR_SIZES.inputLarge.minHeight;
      borderRadius = SENIOR_SIZES.inputLarge.borderRadius;
      break;
  }

  return {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    color: COLORS.foreground,
    fontSize,
    padding,
    minHeight,
    borderRadius,
    textAlignVertical: 'center',
    lineHeight: fontSize * 1.4, // Better line height for readability
  };
};

export const Input = ({ style, size = 'default', placeholderTextColor, ...props }: Props) => {
  const inputStyles = getInputStyles(size);

  return (
    <TextInput 
      {...props} 
      style={[inputStyles, style as any]}
      placeholderTextColor={placeholderTextColor || COLORS.mutedForeground}
    />
  );
};

export default Input;
