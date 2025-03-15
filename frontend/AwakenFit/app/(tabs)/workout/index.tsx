import { useEffect, useState, useReducer } from 'react';
import { Text, TextInput, View, FlatList, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { gql, useLazyQuery } from '@apollo/client';

import { workoutStateReducer, workoutStateProps } from '@/workout/WorkoutStateReducer';

import { ExerciseProps } from '@/workout/properties';

import { baseStyles, lightColors, darkColors } from '@/styles/global';
import CustomButton from '@/components/general/button';

const GET_WORKOUT = gql`
    query GetWorkout($id: ID!) {
        workout(id: $id) {
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
`;

const INITIAL_STATE: workoutStateProps = {
    screen: 'blank',
    template_id: '',
    exercises: []
};

export default function Workout() {
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();

    const [execute, { loading, error, data }] = useLazyQuery(GET_WORKOUT);

    const [state, dispatch] = useReducer(workoutStateReducer, INITIAL_STATE);

    function handleSetExercises(exercises: ExerciseProps[]) {
        dispatch({
            type: 'SET_EXERCISES',
            payload: exercises
        });
    }

    useEffect(() => {
        if (params.id) {
            execute({ variables: { id: params.id } });
        }
    }, []);

    useEffect(() => {
        if (data) {
            console.log('retreived data');
            console.log(data.workout.exercises);
            handleSetExercises(data.workout.exercises);
        }
    }, [data, loading]);

    function stopWorkoutPressed() {
        console.log('Workout Ended');
    }

    console.log(state);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                ...baseStyles.container,
                backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
            }}>
                <View>
                    <Text>Workout Index Page</Text>
                    <CustomButton
                        text="Stop Workout"
                        onPress={stopWorkoutPressed}
                        disabled={false}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
