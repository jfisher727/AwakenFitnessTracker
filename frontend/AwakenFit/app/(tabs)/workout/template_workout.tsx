import { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { gql, useLazyQuery } from '@apollo/client';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import Spinner from '@/components/general/spinner';

import WorkoutList from '@/components/workout/workout_list';

const GET_WORKOUT_TEMPLATES = gql`
    query GetWorkoutTemplates(
        $after: String,
        $count: Int,
        $name: String,
        $template: Boolean) {
            workouts(
                after: $after,
                first: $count,
                name_Icontains: $name,
                template: $template) {
                    edges {
                        cursor
                        node {
                            id
                            name
                            notes
                            exercises {
                                id
                                notes
                                movement {
                                    name
                                    description
                                    primaryMuscleGroup
                                    equipmentType
                                    movementType
                                }
                                sets {
                                    id
                                    sequenceNumber
                                    minReps
                                    maxReps
                                    duration
                                    setType
                                }
                            }
                        }
                    }
            }
    }
`;

export default function TemplateWorkout() {
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
                        <WorkoutList workouts={data.workouts.edges} loading={loading} />
                    }
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
