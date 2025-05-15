import { useEffect, useState, useReducer } from 'react';
import { View, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import { gql, useLazyQuery, useMutation } from '@apollo/client';

import { workoutStateReducer, workoutStateProps, ActionTypes, ScreenOptions } from '@/graphql/WorkoutStateReducer';

import { ExerciseProps, MovementNode } from '@/graphql/properties';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import Spinner from '@/components/general/spinner';

import ExerciseSearch from '@/components/workout/exercise_search';
import MovementList from '@/components/workout/movement_list';
import CurrentExercise from '@/components/workout/current_exercise';
import WorkoutReview from '@/components/workout/workout_review';
import ExerciseHistorical from '@/components/workout/exercise_historical';
import AddSets from '@/components/workout/add_sets';
import WorkoutButtons from '@/components/workout/workout_buttons';

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
                    id
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
    exercises: [],
    editing: false,
    buttons: {
        historical: true,
        add_exercise: true,
        end_workout: true,
        add_set: false,
        edit_movements: false,
    }
};

export default function Workout() {
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const [currentScreen, setCurrentScreen] = useState(<ExerciseSearch addExercise={handleAddExercise} />);

    const [execute, { loading, error, data }] = useLazyQuery(GET_WORKOUT);
    const [workoutMutation, workoutMutationResult] = useMutation(RECORD_WORKOUT_MUTATION);

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

    function handleAddExercise(movement: MovementNode) {
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
                equipment_identifier: '',
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

    function handleRecordSet(exercise_id: string, sequence_number: number, reps?: number, weight?: number, duration?: string, equipment_identifier?: string) {
        dispatch({
            type: ActionTypes.RECORD_SET,
            payload: {
                exercise_id: exercise_id,
                sequence_number: sequence_number,
                reps: reps,
                weight: weight,
                duration: duration,
                equipment_identifier: equipment_identifier,
            }
        });
        // need to see if we've completed all the sets for the current exercise
        var exercise_id_to_display = '';
        state.exercises.every(exercise => {
            var all_sets_complete = exercise.sets.every(set => {
                // this is the set that we just recorded, the state hasn't updated to reflect this set
                if (exercise.id === exercise_id && set.sequenceNumber === sequence_number) {
                    return true;
                }
                if (!(set.completedReps || set.weight || set.duration)) {
                    return false;
                }
                return true;
            });
            if (!all_sets_complete) {
                exercise_id_to_display = exercise.id;
                return false;
            }
            return true;
        });
        if (state.current_exercise !== exercise_id_to_display && exercise_id_to_display) {
            // if the exercise_id_to_display is different from what we're currently displaying, update it
            handleSetCurrentExercise(exercise_id_to_display);
        }
        else if (!exercise_id_to_display) {
            // we've completed all the exercises so we should end the workout?
            handleSetStopTime();
            handleChangeScreen(ScreenOptions.WORKOUT_REVIEW);
        }
    }

    function handleAddSets(count: number) {
        dispatch({
            type: ActionTypes.ADD_SETS,
            payload: {
                exercise_id: state.current_exercise,
                sets: count,
            }
        });
        handleChangeScreen(ScreenOptions.CURRENT_EXERCISE);
    }

    function handleButtonsToShow(historical: boolean, add_exercise: boolean, end_workout: boolean, add_set: boolean, edit_movements: boolean) {
        dispatch({
            type: ActionTypes.UPDATE_BUTTONS,
            payload: {
                historical: historical,
                add_exercise: add_exercise,
                edit_movements: edit_movements,
                end_workout: end_workout,
                add_set: add_set
            }
        });
    }

    function handleEditMovements() {
        dispatch({
            type: ActionTypes.EDIT_MOVEMENTS,
            payload: !state.editing
        });
    }

    function handleMoveExerciseUp(index: number) {
        dispatch({
            type: ActionTypes.MOVE_EXERCISE_UP,
            payload: index
        });
    }

    function handleMoveExerciseDown(index: number) {
        dispatch({
            type: ActionTypes.MOVE_EXERCISE_DOWN,
            payload: index
        });
    }

    function handleRecordWorkout() {
        // TODO: Need to format all the data we've collected into the proper JSON structure
        // to send to the GraphQL mutation
        var mutation_input = {
            'startTime': state.start_time,
            'stopTime': state.start_time,
            'exercises': []
        };
        state.exercises.forEach((element) => {
            var exercise_data = {
                'movementId': element.movement.id,
                'standardSets': [],
            };
            element.sets.forEach((set) => {
                var set_data = {
                    'sequenceNumber': set.sequenceNumber,
                };
                if (set.completedReps && set.completedReps > 0) {
                    set_data.completedReps = set.completedReps;
                }
                if (set.weight && set.weight > 0) {
                    set_data.weight = set.weight;
                }
                if (set.equipment_identifier && set.equipment_identifier.length > 0) {
                    set_data.equipmentIdentifier = set.equipment_identifier;
                }
                exercise_data.standardSets.push(set_data);
            });
            mutation_input.exercises.push(exercise_data);
        });
        workoutMutation({
            variables: {
                input: mutation_input
            }
        });
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

    function navigateToCurrentExercise() {
        handleChangeScreen(ScreenOptions.CURRENT_EXERCISE);
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
        if (workoutMutationResult.data) {
            console.log('workoutMutationResult data');
            console.log(workoutMutationResult.data);
            if (workoutMutationResult.data.workoutCreateCompleted?.errors) {
                console.log(workoutMutationResult.data.workoutCreateCompleted.errors);
            }
            else {
                router.navigate("/(tabs)");
            }
        }
        if (workoutMutationResult.error) {
            console.log('workoutMutationResult error');
            console.log(workoutMutationResult.error);
        }

    }, [workoutMutationResult.data, workoutMutationResult.error]);

    useEffect(() => {
        if (state.screen) {
            switch (state.screen) {
                case ScreenOptions.MOVEMENT_LIST: {
                    setCurrentScreen(
                        <MovementList
                            exercises={state.exercises}
                            editable={state.editing}
                            showSets={false}
                            moveExerciseUp={handleMoveExerciseUp}
                            moveExerciseDown={handleMoveExerciseDown}
                            setCurrentExercise={handleSetCurrentExercise}
                            removeExercise={handleRemoveExercise}
                        />);
                    handleButtonsToShow(false, true, true, false, true);
                    return;
                }
                case ScreenOptions.ADD_EXERCISE: {
                    setCurrentScreen(<ExerciseSearch addExercise={handleAddExercise} />);
                    handleButtonsToShow(false, false, false, false, false);
                    return;
                }
                case ScreenOptions.ADD_SETS: {
                    setCurrentScreen(
                        <AddSets
                            navigateBack={navigateToCurrentExercise}
                            addSets={handleAddSets}
                        />
                    );
                    handleButtonsToShow(false, false, false, false, false);
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
                    handleButtonsToShow(true, false, false, true, false);
                    return;
                }
                case ScreenOptions.HISTORICAL: {
                    var current_exercise = state.exercises.filter((e) => e.id === state.current_exercise)[0];
                    setCurrentScreen(
                        <ExerciseHistorical
                            movementId={current_exercise.movement.id}
                            navigateBack={navigateToCurrentExercise}
                        />);
                    handleButtonsToShow(false, false, false, false, false);
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
                    handleButtonsToShow(false, false, false, false, false);
                    return;
                }
                default: {
                    setCurrentScreen(<MovementList
                        exercises={state.exercises}
                        editable={state.editing}
                        showSets={false}
                        moveExerciseUp={handleMoveExerciseUp}
                        moveExerciseDown={handleMoveExerciseDown}
                        setCurrentExercise={handleSetCurrentExercise}
                        removeExercise={handleRemoveExercise}
                    />);
                    handleButtonsToShow(false, true, false, false, true);
                    return;
                }
            }
        }

    }, [state.screen, state.exercises, state.current_exercise, state.editing]);

    function stopWorkoutPressed() {
        handleChangeScreen(ScreenOptions.WORKOUT_REVIEW);
    }

    function addExercisePressed() {
        handleChangeScreen(ScreenOptions.ADD_EXERCISE);
    }

    function addSetPressed() {
        handleChangeScreen(ScreenOptions.ADD_SETS);
    }

    function historicalPresssed() {
        handleChangeScreen(ScreenOptions.HISTORICAL);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                ...baseStyles.container,
                backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
            }}>
                <View style={baseStyles.container}>
                    <View style={baseStyles.screenContainer}>
                        {loading || workoutMutationResult.loading && <Spinner />}
                        {currentScreen}
                    </View>
                    <View style={baseStyles.buttonContainer}>
                        <WorkoutButtons
                            state={state.buttons}
                            stopWorkoutPressed={stopWorkoutPressed}
                            addExercisePressed={addExercisePressed}
                            editMovementsPressed={handleEditMovements}
                            addSetPressed={addSetPressed}
                            historicalPressed={historicalPresssed}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
