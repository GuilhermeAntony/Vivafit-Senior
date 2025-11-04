import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from './text';
import { COLORS, SPACING, LAYOUT } from '../../styles/designTokens';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
  style?: ViewStyle;
};

export const Header = ({ 
  title, 
  showBackButton = true, 
  rightComponent, 
  onBackPress,
  style 
}: HeaderProps) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: LAYOUT.headerHeight,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  };

  const leftSectionStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  };

  const titleSectionStyle: ViewStyle = {
    flex: 2,
    alignItems: 'center',
  };

  const rightSectionStyle: ViewStyle = {
    flex: 1,
    alignItems: 'flex-end',
  };

  const backButtonStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  };

  return (
    <View style={[headerStyle, style]}>
      <View style={leftSectionStyle}>
        {showBackButton && (
          <TouchableOpacity 
            style={backButtonStyle}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Text variant="title" color="foreground">
              ←
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={titleSectionStyle}>
        <Text variant="title" color="foreground">
          {title}
        </Text>
      </View>

      <View style={rightSectionStyle}>
        {rightComponent}
      </View>
    </View>
  );
};

export default Header;