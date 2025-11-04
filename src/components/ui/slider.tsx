import React from 'react';
import { View } from 'react-native';
import RNSlider from '@react-native-community/slider';

type Props = {
  value: number | number[];
  onValueChange?: (v: any) => void;
  minimumValue?: number;
  maximumValue?: number;
};

export const Slider = ({ value, onValueChange, minimumValue=0, maximumValue=100 }: Props) => {
  const sliderValue = Array.isArray(value) ? value[0] : value;
  return (
    <View>
      <RNSlider value={sliderValue} onValueChange={onValueChange} minimumValue={minimumValue} maximumValue={maximumValue} />
    </View>
  );
};

export default Slider;
