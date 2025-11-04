import React from 'react';
import { Text, View } from 'react-native';

type Props = { children: React.ReactNode; style?: any };

export const Badge = ({ children, style }: Props) => (
  <View style={[{paddingHorizontal:8,paddingVertical:4,borderRadius:999,backgroundColor:'#eee'}, style]}>
    <Text style={{fontSize:12}}>{children as any}</Text>
  </View>
);

export default Badge;
