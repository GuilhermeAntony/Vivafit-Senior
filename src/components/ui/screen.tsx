import React from 'react';
import { View, ScrollView, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, LAYOUT, SPACING } from '../../styles/designTokens';

type ScreenProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  safeArea?: boolean;
  backgroundColor?: keyof typeof COLORS;
  padding?: boolean;
  style?: ViewStyle;
};

export const Screen = ({ 
  children, 
  scrollable = false,
  safeArea = true,
  backgroundColor = 'background',
  padding = true,
  style 
}: ScreenProps) => {
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: COLORS[backgroundColor],
  };

  const contentStyle: ViewStyle = {
    flex: 1,
    ...(padding && { padding: LAYOUT.containerPadding }),
  };

  const Container = safeArea ? SafeAreaView : View;
  const Content = scrollable ? ScrollView : View;

  const scrollViewProps = scrollable ? {
    contentContainerStyle: { 
      flexGrow: 1,
      ...(padding && { padding: LAYOUT.containerPadding, paddingBottom: LAYOUT.containerPadding * 2 }),
    },
    showsVerticalScrollIndicator: false,
  } : {};

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS[backgroundColor]} 
        translucent={false}
      />
      <Container style={[containerStyle, style]}>
        <Content 
          {...(scrollable ? scrollViewProps : {})}
          style={scrollable ? undefined : contentStyle}
        >
          {children}
        </Content>
      </Container>
    </>
  );
};

export default Screen;