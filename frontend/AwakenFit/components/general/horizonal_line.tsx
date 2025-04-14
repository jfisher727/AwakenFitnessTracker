import { View, useColorScheme, StyleSheet } from 'react-native';

import { lightColors, darkColors } from '@/styles/global';

export default function HorzontalLine() {
    const colorScheme = useColorScheme();
    return (
        <View style={{
            borderBottomColor: colorScheme === 'light' ? lightColors.secondaryColor : darkColors.secondaryColor,
            borderBottomWidth: StyleSheet.hairlineWidth,
        }} />
    );
}
