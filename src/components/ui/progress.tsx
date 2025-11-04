import React from 'react';
import { View } from 'react-native';

type Props = { value: number; style?: any };

export const Progress = ({ value, style }: Props) => {
  const capped = Math.max(0, Math.min(100, value));
  return (
    <View style={[{height:8,backgroundColor:'#eee',borderRadius:8,overflow:'hidden'}, style]}>
      <View style={{width: `${capped}%`, height: '100%', backgroundColor:'#0ea5a3'}} />
    </View>
  );
};

export default Progress;
