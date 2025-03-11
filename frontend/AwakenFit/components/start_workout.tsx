import { Text, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';

import { baseStyles, lightColors, darkColors } from '@/styles/global';
import CustomButton from './general/button';

export default function StartWorkout() {
    const colorScheme = useColorScheme();

    function openModal() {
        router.navigate("/(tabs)/workout/modal")
    }

    return (
        <View>
            <Text
                style={{
                    ...baseStyles.subHeader,
                    color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                }}>
                Start a Workout component
            </Text>
            <Text>
                Your scheduled workout goes here
            </Text>
            <View style={baseStyles.centeredRow}>
                <CustomButton text="Start a Workout" onPress={openModal} disabled={false} />
            </View>
        </View>
    );
}
