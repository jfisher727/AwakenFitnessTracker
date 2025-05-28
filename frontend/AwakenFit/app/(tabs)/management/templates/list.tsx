import { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { gql, useLazyQuery } from '@apollo/client';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import { GET_WORKOUT_TEMPLATES } from '@/graphql/queries';

import Spinner from '@/components/general/spinner';

import WorkoutList from '@/components/workout/workout_list';


export default function List() {
    const [execute, { loading, error, data }] = useLazyQuery(GET_WORKOUT_TEMPLATES);
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
                        <WorkoutList workouts={data.workouts.edges} start_workout_enabled={false} />
                    }
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
