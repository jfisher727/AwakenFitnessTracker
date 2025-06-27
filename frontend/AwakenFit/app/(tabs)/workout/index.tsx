import { useEffect, useReducer } from "react";
import { View, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";

import {
    workoutStateReducer,
    workoutStateProps,
    ActionTypes,
    ScreenOptions,
} from "@/graphql/WorkoutStateReducer";

import { ExerciseProps } from "@/graphql/properties";

import {
    useGetWorkoutLazyQuery,
    useWorkoutCreateCompletedMutation,
    MovementNode,
    WorkoutCreateCompletedInput,
    ExerciseCreateCompletedInput,
    SetCreateCompletedInput,
} from "@/graphql/types";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import Spinner from "@/components/general/spinner";

import ExerciseSearch from "@/components/workout/exercise_search";
import MovementList from "@/components/workout/movement_list";
import CurrentExercise from "@/components/workout/current_exercise";
import WorkoutReview from "@/components/workout/workout_review";
import ExerciseHistorical from "@/components/workout/exercise_historical";
import AddSets from "@/components/workout/add_sets";
import WorkoutButtons from "@/components/workout/workout_buttons";

function CurrentISOFormattedDate() {
    return new Date().toISOString();
}

const INITIAL_STATE: workoutStateProps = {
    screen: "blank",
    template_id: "",
    start_time: CurrentISOFormattedDate(),
    stop_time: "",
    current_exercise: "",
    exercises: [],
    editing: false,
    buttons: {
        historical: true,
        add_exercise: true,
        end_workout: true,
        add_set: false,
        edit_movements: false,
    },
};

export default function Workout() {
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();

    const [execute, { loading, error, data }] = useGetWorkoutLazyQuery();
    const [workoutMutation, workoutMutationResult] =
        useWorkoutCreateCompletedMutation();

    const [state, dispatch] = useReducer(workoutStateReducer, INITIAL_STATE);

    function handleSetExercises(exercises: ExerciseProps[]) {
        dispatch({
            type: ActionTypes.SET_EXERCISES,
            payload: exercises,
        });
    }

    function handleSetStopTime() {
        dispatch({
            type: ActionTypes.SET_STOP_TIME,
            payload: CurrentISOFormattedDate(),
        });
    }

    function handleAddExercise(movement: MovementNode) {
        const currentExerciseCount = state.exercises.length + 1;
        var exercise: ExerciseProps = {
            id: "addedExercise" + Math.floor(Date.now() / 1000),
            notes: "",
            movement: movement,
            sets: [
                {
                    id: "",
                    sequenceNumber: 1,
                    minReps: 0,
                    maxReps: 0,
                    completedReps: 0,
                    weight: 0,
                    duration: "",
                    equipment_identifier: "",
                    setType: "Standard",
                    parentSet: "",
                },
            ],
        };
        dispatch({
            type: ActionTypes.ADD_EXERCISE,
            payload: exercise,
        });
    }

    function handleRemoveExercise(id: string) {
        dispatch({
            type: ActionTypes.REMOVE_EXERCISE,
            payload: id,
        });
    }

    function handleSetCurrentExercise(id: string) {
        dispatch({
            type: ActionTypes.SET_CURRENT_EXERCISE,
            payload: id,
        });
        handleChangeScreen(ScreenOptions.CURRENT_EXERCISE);
    }

    function handleRecordSet(
        exercise_id: string,
        sequence_number: number,
        reps?: number,
        weight?: number,
        duration?: string,
        equipment_identifier?: string
    ) {
        dispatch({
            type: ActionTypes.RECORD_SET,
            payload: {
                exercise_id: exercise_id,
                sequence_number: sequence_number,
                reps: reps,
                weight: weight,
                duration: duration,
                equipment_identifier: equipment_identifier,
            },
        });
        // need to see if we've completed all the sets for the current exercise
        const currentExerciseIdx = state.exercises.findIndex(
            (exercise) => exercise.id === exercise_id
        );
        if (currentExerciseIdx === -1) return;
        const currentExercise = state.exercises[currentExerciseIdx];
        const currentSets = (currentExercise.sets ?? []).filter(Boolean);
        const allSetsComplete = currentSets.every((set) => {
            // if the current set, return true for it
            if (set?.sequenceNumber == sequence_number) {
                return true;
            }
            return set?.completedReps || set?.weight || set?.duration;
        });
        if (!allSetsComplete) {
            // Stay on this exercise, let the user keep working
            return;
        }

        // Find the next exercise (after current) that isn't fully complete
        let nextIncompleteExerciseId: string | null = null;
        for (let i = currentExerciseIdx + 1; i < state.exercises.length; i++) {
            const exercise = state.exercises[i];
            const sets = (exercise.sets ?? []).filter(Boolean);
            const isIncomplete = sets.some(
                (set) => !(set?.completedReps || set?.weight || set?.duration)
            );
            if (isIncomplete) {
                nextIncompleteExerciseId = exercise.id;
                break;
            }
        }
        if (nextIncompleteExerciseId) {
            // if the exercise_id_to_display is different from what we're currently displaying, update it
            handleSetCurrentExercise(nextIncompleteExerciseId);
        } else {
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
            },
        });
        handleChangeScreen(ScreenOptions.CURRENT_EXERCISE);
    }

    function handleButtonsToShow(
        historical: boolean,
        add_exercise: boolean,
        end_workout: boolean,
        add_set: boolean,
        edit_movements: boolean
    ) {
        dispatch({
            type: ActionTypes.UPDATE_BUTTONS,
            payload: {
                historical: historical,
                add_exercise: add_exercise,
                edit_movements: edit_movements,
                end_workout: end_workout,
                add_set: add_set,
            },
        });
    }

    function handleEditMovements() {
        dispatch({
            type: ActionTypes.EDIT_MOVEMENTS,
            payload: !state.editing,
        });
    }

    function handleMoveExerciseUp(index: number) {
        dispatch({
            type: ActionTypes.MOVE_EXERCISE_UP,
            payload: index,
        });
    }

    function handleMoveExerciseDown(index: number) {
        dispatch({
            type: ActionTypes.MOVE_EXERCISE_DOWN,
            payload: index,
        });
    }

    function handleRecordWorkout() {
        var mutation_input: WorkoutCreateCompletedInput = {
            startTime: state.start_time,
            stopTime: state.start_time,
            exercises: [],
        };
        state.exercises.forEach((element) => {
            var exercise_data: ExerciseCreateCompletedInput = {
                movementId: element.movement.id,
                standardSets: [],
            };
            element?.sets?.forEach((set) => {
                var set_data: SetCreateCompletedInput = {
                    sequenceNumber: set?.sequenceNumber || 1,
                    completedReps: set?.completedReps,
                    weight: set?.weight,
                    equipmentIdentifier: set?.equipmentIdentifier,
                    duration: set?.duration,
                };
                exercise_data?.standardSets?.push(set_data);
            });
            mutation_input.exercises.push(exercise_data);
        });
        workoutMutation({
            variables: {
                input: mutation_input,
            },
        });
    }

    function handleChangeScreen(name: string, template_id?: string) {
        dispatch({
            type: ActionTypes.CHANGE_SCREEN,
            payload: {
                name: name,
                template_id: template_id,
            },
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
            handleSetExercises(data?.workout?.exercises);
            handleChangeScreen(ScreenOptions.MOVEMENT_LIST);
        }
    }, [data, loading]);

    useEffect(() => {
        if (workoutMutationResult.data) {
            if (
                workoutMutationResult?.data?.workoutCreateCompleted?.errors
                    ?.length > 0
            ) {
                console.log(
                    workoutMutationResult.data.workoutCreateCompleted.errors
                );
            }
        }
        if (workoutMutationResult.error) {
            console.log(workoutMutationResult.error);
        }
    }, [workoutMutationResult.data, workoutMutationResult.error]);

    useEffect(() => {
        if (state.screen) {
            switch (state.screen) {
                case ScreenOptions.MOVEMENT_LIST: {
                    handleButtonsToShow(false, true, true, false, true);
                    return;
                }
                case ScreenOptions.ADD_EXERCISE: {
                    handleButtonsToShow(false, false, false, false, false);
                    return;
                }
                case ScreenOptions.ADD_SETS: {
                    handleButtonsToShow(false, false, false, false, false);
                    return;
                }
                case ScreenOptions.CURRENT_EXERCISE: {
                    handleButtonsToShow(true, false, false, true, false);
                    return;
                }
                case ScreenOptions.HISTORICAL: {
                    handleButtonsToShow(false, false, false, false, false);
                    return;
                }
                case ScreenOptions.WORKOUT_REVIEW: {
                    handleButtonsToShow(false, false, false, false, false);
                    return;
                }
                default: {
                    handleButtonsToShow(false, true, false, false, true);
                    return;
                }
            }
        }
    }, [state.screen]);

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

    function getCurrentExercise() {
        return state.exercises.filter(
            (e) => e.id === state.current_exercise
        )[0];
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    ...baseStyles.container,
                    backgroundColor:
                        colorScheme === "light"
                            ? lightColors.background
                            : darkColors.background,
                }}
            >
                <View style={baseStyles.container}>
                    <View
                        style={{
                            ...baseStyles.screenContainer,
                        }}
                    >
                        {(loading || workoutMutationResult.loading) && (
                            <Spinner />
                        )}
                        {state.screen === ScreenOptions.MOVEMENT_LIST && (
                            <MovementList
                                exercises={state.exercises}
                                editable={state.editing}
                                showSets={false}
                                moveExerciseUp={handleMoveExerciseUp}
                                moveExerciseDown={handleMoveExerciseDown}
                                setCurrentExercise={handleSetCurrentExercise}
                                removeExercise={handleRemoveExercise}
                            />
                        )}
                        {state.screen === ScreenOptions.ADD_SETS && (
                            <AddSets
                                navigateBack={navigateToCurrentExercise}
                                addSets={handleAddSets}
                            />
                        )}
                        {state.screen === ScreenOptions.ADD_EXERCISE && (
                            <ExerciseSearch addExercise={handleAddExercise} />
                        )}
                        {state.screen === ScreenOptions.CURRENT_EXERCISE && (
                            <CurrentExercise
                                exercise={getCurrentExercise()}
                                recordSet={handleRecordSet}
                                navigateBack={handleChangeScreen}
                            />
                        )}
                        {state.screen === ScreenOptions.HISTORICAL && (
                            <ExerciseHistorical
                                movementId={getCurrentExercise().movement.id}
                                navigateBack={navigateToCurrentExercise}
                            />
                        )}
                        {state.screen === ScreenOptions.WORKOUT_REVIEW && (
                            <WorkoutReview
                                exercises={state.exercises}
                                start_time={state.start_time}
                                stop_time={state.stop_time}
                                setCurrentExercise={handleSetCurrentExercise}
                                recordWorkout={handleRecordWorkout}
                            />
                        )}
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
