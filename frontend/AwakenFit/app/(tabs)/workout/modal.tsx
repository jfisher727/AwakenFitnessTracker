import { View, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomButton from '@/components/general/button';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

export default function Modal() {
    const colorScheme = useColorScheme();

    function scheduledWorkoutPressed() {
        // need to load the schedule workout's template id?
        //router.navigate('/(tabs)/workout/scheduled_workout');
        console.log('scheduled workout pressed');
    }

    function templateWorkoutPressed() {
        router.navigate('/(tabs)/workout/template_workout');
    }

    function blankWorkoutPressed() {
        router.push({ pathname: '/(tabs)/workout' });
    }

    function cancelPressed() {
        router.navigate('/(tabs)');
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                ...baseStyles.container,
                backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
            }}>
                <View style={baseStyles.modal}>
                    <CustomButton
                        text="Scheduled Workout"
                        onPress={scheduledWorkoutPressed}
                        disabled={false}
                    />
                    <CustomButton
                        text="Workout Template"
                        onPress={templateWorkoutPressed}
                        disabled={false}
                    />
                    <CustomButton
                        text="Empty Workout"
                        onPress={blankWorkoutPressed}
                        disabled={false}
                    />
                    <CustomButton
                        text="Cancel"
                        onPress={cancelPressed}
                        disabled={false}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
