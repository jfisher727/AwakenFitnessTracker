import { Text, View, useColorScheme } from 'react-native';

import { baseStyles, lightColors, darkColors } from '@/styles/global';
import CustomButton from './button';

export default function StartWorkout() {
    const colorScheme = useColorScheme();
    return (
        <View>
            <Text
                style={{
                    ...baseStyles.subHeader,
                    color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                }}>
                Start a Workout component
            </Text>
        </View>
    );
}
