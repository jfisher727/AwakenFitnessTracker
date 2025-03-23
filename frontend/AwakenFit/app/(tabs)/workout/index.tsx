import { useEffect, useState, useReducer } from 'react';
import { Text, TextInput, View, FlatList, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { gql, useLazyQuery, useMutation } from '@apollo/client';

import { workoutStateReducer, workoutStateProps, ActionTypes, ScreenOptions } from '@/graphql/WorkoutStateReducer';

import { ExerciseProps, MomvementNode } from '@/graphql/properties';

import { baseStyles, lightColors, darkColors } from '@/styles/global';
import CustomButton from '@/components/general/button';

import ExerciseSearch from '@/components/workout/exercise_search';
import MovementList from '@/components/workout/movement_list';
import CurrentExercise from '@/components/workout/current_exercise';
import WorkoutReview from '@/components/workout/workout_review';

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
                    completedReps
                    minReps
                    maxReps
                    weight
                    duration
                    setType
                }
            }
        }
    }
`;

const RECORD_WORKOUT_MUTATION = gql`
    mutation WorkoutCreateCompleted($input:WorkoutCreateCompletedInput!){
        workoutCreateCompleted(input:$input){
            workout {
                id
            }
            errors {
                message
            }
        }
    }`;

function CurrentISOFormattedDate() {
    return new Date().toISOString();
}

const INITIAL_STATE: workoutStateProps = {
    screen: 'blank',
    template_id: '',
    start_time: CurrentISOFormattedDate(),
    stop_time: '',
    current_exercise: '',
    exercises: []
};

export default function Workout() {
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const [currentScreen, setCurrentScreen] = useState(<ExerciseSearch addExercise={handleAddExercise} />);

    const [execute, { loading, error, data }] = useLazyQuery(GET_WORKOUT);
    const [graphqlWorkout, graphqlWorkoutResult] = useMutation(RECORD_WORKOUT_MUTATION);

    const [state, dispatch] = useReducer(workoutStateReducer, INITIAL_STATE);

    function handleSetExercises(exercises: ExerciseProps[]) {
        dispatch({
            type: ActionTypes.SET_EXERCISES,
            payload: exercises
        });
    }

    function handleSetStopTime() {
        dispatch({
            type: ActionTypes.SET_STOP_TIME,
            payload: CurrentISOFormattedDate()
        });
    }

    function handleAddExercise(movement: MomvementNode) {
        const currentExerciseCount = state.exercises.length + 1;
        var exercise: ExerciseProps = {
            id: 'addedExercise' + currentExerciseCount.toString(),
            notes: '',
            movement: movement,
            sets: [{
                id: '',
                sequenceNumber: 1,
                minReps: 0,
                maxReps: 0,
                completedReps: 0,
                weight: 0,
                duration: '',
                setType: 'Standard',
                parentSet: ''
            }]
        };
        dispatch({
            type: ActionTypes.ADD_EXERCISE,
            payload: exercise
        });
    }

    function handleRemoveExercise(id: string) {
        dispatch({
            type: ActionTypes.REMOVE_EXERCISE,
            payload: id
        });
    }

    function handleSetCurrentExercise(id: string) {
        dispatch({
            type: ActionTypes.SET_CURRENT_EXERCISE,
            payload: id
        });
        handleChangeScreen(ScreenOptions.CURRENT_EXERCISE);
    }

    function handleRecordSet(exercise_id: string, sequence_number: number, reps?: number, weight?: number, duration?: string) {
        dispatch({
            type: ActionTypes.RECORD_SET,
            payload: {
                exercise_id: exercise_id,
                sequence_number: sequence_number,
                reps: reps,
                weight: weight,
                duration: duration
            }
        });
        // need to see if we've completed all the sets for the current exercise
        var exercise_id_to_display = '';
        state.exercises.every(exercise => {
            var all_sets_complete = true;
            exercise.sets.every(set => {
                if (!(set.completedReps || set.weight || set.duration)) {
                    all_sets_complete = false;
                }
            });
            if (!all_sets_complete) {
                exercise_id_to_display = exercise.id;
                return false;
            }
            return true;
        });
        if (state.current_exercise !== exercise_id_to_display && exercise_id_to_display) {
            handleSetCurrentExercise(exercise_id_to_display);
        }
        else if (!exercise_id_to_display) {
            // we've completed all the exercises so we should end the workout?
            handleSetStopTime();
            handleChangeScreen(ScreenOptions.WORKOUT_REVIEW);
        }
    }

    function handleRecordWorkout() {
        console.log('recording working');
        // TODO: Need to format all the data we've collected into the proper JSON structure
        // to send to the GraphQL mutation
    }

    function handleChangeScreen(name: string, template_id?: string) {
        dispatch({
            type: ActionTypes.CHANGE_SCREEN,
            payload: {
                name: name,
                template_id: template_id
            }
        });
    }

    useEffect(() => {
        if (params.id) {
            execute({ variables: { id: params.id } });
        }
    }, []);

    useEffect(() => {
        if (data) {
            handleSetExercises(data.workout.exercises);
            handleChangeScreen(ScreenOptions.MOVEMENT_LIST);
        }
    }, [data, loading]);

    useEffect(() => {
        if (state.screen) {
            switch (state.screen) {
                case ScreenOptions.MOVEMENT_LIST: {
                    setCurrentScreen(
                        <MovementList
                            exercises={state.exercises}
                            setCurrentExercise={handleSetCurrentExercise}
                            removeExercise={handleRemoveExercise}
                        />);
                    return;
                }
                case ScreenOptions.ADD_EXERCISE: {
                    setCurrentScreen(<ExerciseSearch addExercise={handleAddExercise} />);
                    return;
                }
                case ScreenOptions.CURRENT_EXERCISE: {
                    var current_exercise = state.exercises.filter((e) => e.id === state.current_exercise)[0];
                    setCurrentScreen(
                        <CurrentExercise
                            exercise={current_exercise}
                            recordSet={handleRecordSet}
                            navigateBack={handleChangeScreen}
                        />);
                    return;
                }
                case ScreenOptions.HISTORICAL: {
                    setCurrentScreen(<Text>Historical</Text>);
                    return;
                }
                case ScreenOptions.WORKOUT_REVIEW: {
                    setCurrentScreen(
                        <WorkoutReview
                            exercises={state.exercises}
                            start_time={state.start_time}
                            stop_time={state.stop_time}
                            recordWorkout={handleRecordWorkout}
                        />
                    )
                    return;
                }
                default: {
                    setCurrentScreen(<MovementList
                        exercises={state.exercises}
                        setCurrentExercise={handleSetCurrentExercise}
                        removeExercise={handleRemoveExercise}
                    />);
                    return;
                }
            }
        }

    }, [state.screen, state.exercises, state.current_exercise]);

    function stopWorkoutPressed() {
        handleChangeScreen(ScreenOptions.WORKOUT_REVIEW);
    }

    function addExercisePressed() {
        handleChangeScreen(ScreenOptions.ADD_EXERCISE);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                ...baseStyles.container,
                backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
            }}>
                <View>
                    {currentScreen}
                    <View style={baseStyles.spacedRow}>
                        <CustomButton
                            text="Stop Workout"
                            onPress={stopWorkoutPressed}
                            disabled={false}
                        />
                        <CustomButton
                            text="Add Exercise"
                            onPress={addExercisePressed}
                            disabled={false}
                        />

                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
