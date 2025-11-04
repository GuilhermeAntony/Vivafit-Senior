import React from 'react';
import { Text, TextProps } from 'react-native';

export const Label = ({ children, style, ...rest }: TextProps) => (
  <Text {...rest} style={[{fontSize:16,fontWeight:'600',marginBottom:6}, style as any]}>
    {children}
  </Text>
);

export default Label;
