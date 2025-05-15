import { View, ActivityIndicator, useColorScheme } from 'react-native';

import { lightColors, darkColors } from '@/styles/global';

import { baseStyles } from '@/styles/global';

export default function Spinner() {
    const colorScheme = useColorScheme();
    return (
        <View style={baseStyles.centeredColumn}>
            <ActivityIndicator
                size="large"
                color={colorScheme === "light" ? lightColors.primaryColor : darkColors.primaryColor}
            />
        </View>
    );
}
