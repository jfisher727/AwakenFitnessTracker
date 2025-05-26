import { useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import CustomButton from '@/components/general/button';

import Calendar from '@/components/workout/calendar';


export default function Management() {
    const colorScheme = useColorScheme();

    function workoutTemplatesPressed() {
        router.navigate("/(tabs)/management/templates");
    }

    function programPressed() {

    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                ...baseStyles.container,
                backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
            }}>
                <Calendar />

                <CustomButton text="Workout Templates" onPress={workoutTemplatesPressed} disabled={false} />
                <CustomButton text="Workout Programs" onPress={programPressed} disabled={false} />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
