import { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import { useGetWorkoutTemplatesLazyQuery } from '@/graphql/types';

import Spinner from '@/components/general/spinner';

import WorkoutList from '@/components/workout/workout_list';


export default function TemplateWorkout() {
    const [execute, { loading, error, data }] = useGetWorkoutTemplatesLazyQuery();
    const colorScheme = useColorScheme();

    useEffect(() => {
        execute({ variables: { count: 20, template: true } });
    }, []);

    if (error) {
        console.log(error);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                ...baseStyles.container,
                backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
            }}>
                <View style={baseStyles.modal}>
                    {
                        loading &&
                        <Spinner />
                    }
                    {
                        data &&
                        <WorkoutList workouts={data?.workouts?.edges} start_workout_enabled={true} />
                    }
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
