import { Text, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';

import CustomButton from '@/components/general/button';

import { baseStyles } from '@/styles/global';

export default function Modal() {
    const colorScheme = useColorScheme();

    function scheduledWorkoutPressed() {
        // need to load the schedule workout's template id?
        router.navigate('/(tabs)/workout/scheduled_workout');
    }

    function templateWorkoutPressed() {
        router.navigate('/(tabs)/workout/template_workout');
    }

    function blankWorkoutPressed() {
        router.push({ pathname: '/(tabs)/workout' });
    }

    function cancelPressed() {
        router.navigate('../');
    }

    return (
        <View style={baseStyles.container}>
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
    );
}
