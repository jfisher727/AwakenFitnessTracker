import { useEffect, useState, useReducer } from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { gql, useMutation } from '@apollo/client';

import { workoutStateReducer, workoutStateProps, ActionTypes, ScreenOptions } from '@/graphql/WorkoutStateReducer';

import { ExerciseProps, MovementNode, SetNode } from '@/graphql/properties';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import AddTemplateSets from '@/components/workout/add_template_sets';
import ExerciseSearch from '@/components/workout/exercise_search';
import MovementList from '@/components/workout/movement_list';
import TemplateButtons from '@/components/workout/template_buttons';
import { TextInput } from 'react-native-gesture-handler';

const RECORD_WORKOUT_MUTATION = gql`
    mutation WorkoutCreateTemplate($input:WorkoutCreateTemplateInput!){
        workoutCreateTemplate(input:$input){
            workout {
                id
            }
            errors {
                message
            }
        }
    }`;

const INITIAL_STATE: workoutStateProps = {
    screen: 'blank',
    template_id: '',
    start_time: '',
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

export default function Templates() {
    const colorScheme = useColorScheme();
    var initialExercise: MovementNode = { id: '', name: '', description: '', primaryMuscleGroup: '', equipmentType: '', movementType: '' };

    const [templateName, setTemplateName] = useState('Test template');
    const [currentScreen, setCurrentScreen] = useState(<ExerciseSearch addExercise={handleSetCurrentExercise} />);
    const [currentExercise, setCurrentExercise] = useState(initialExercise);
    const [workoutMutation, workoutMutationResult] = useMutation(RECORD_WORKOUT_MUTATION);
    const [state, dispatch] = useReducer(workoutStateReducer, INITIAL_STATE);

    function handleAddExercise(movement: MovementNode, setDetails: SetNode[]) {
        const currentExerciseCount = state.exercises.length + 1;
        var exercise: ExerciseProps = {
            id: 'addedExercise' + currentExerciseCount.toString(),
            notes: '',
            movement: movement,
            sets: setDetails
        };
        dispatch({
            type: ActionTypes.ADD_EXERCISE,
            payload: exercise
        });
    }

    function handleSelectExercise(movement: MovementNode) {
        setCurrentExercise(movement);
        handleChangeScreen(ScreenOptions.ADD_SETS);
    }

    function handleAddSets(setDetails: SetNode[]) {
        handleAddExercise(currentExercise, setDetails);
    }

    function handleButtonsToShow(add_exercise: boolean, edit_movements: boolean) {
        dispatch({
            type: ActionTypes.UPDATE_BUTTONS,
            payload: {
                historical: false,
                add_exercise: add_exercise,
                edit_movements: edit_movements,
                end_workout: false,
                add_set: false
            }
        });
    }

    function navigateToMovementList() {
        handleChangeScreen(ScreenOptions.MOVEMENT_LIST);
    }

    function handleSetCurrentExercise() {
        // intentionally empty to satisfy components that need it
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

    function handleRemoveExercise(id: string) {
        dispatch({
            type: ActionTypes.REMOVE_EXERCISE,
            payload: id
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

    function addExercisePressed() {
        handleChangeScreen(ScreenOptions.ADD_EXERCISE);
    }

    function handleSaveTemplate() {
        var mutation_input = {
            'name': templateName,
            'exercises': []
        }
        state.exercises.forEach((element) => {
            var exercise_data = {
                'movementId': element.movement.id,
                'standardSets': [],
            };
            element.sets.forEach((set) => {
                var set_data = {
                    'sequenceNumber': set.sequenceNumber,
                    'minReps': set.minReps,
                    'maxReps': set.maxReps,
                    'duration': set.duration
                };
                exercise_data.standardSets.push(set_data);
            });
            mutation_input.exercises.push(exercise_data);
        });
        console.log(JSON.stringify(mutation_input));
        workoutMutation({
            variables: {
                input: mutation_input
            }
        });
    }

    useEffect(() => {
        if (state.screen) {
            switch (state.screen) {
                case ScreenOptions.MOVEMENT_LIST: {
                    setCurrentScreen(
                        <MovementList
                            exercises={state.exercises}
                            editable={state.editing}
                            showSets={true}
                            moveExerciseUp={handleMoveExerciseUp}
                            moveExerciseDown={handleMoveExerciseDown}
                            setCurrentExercise={handleSetCurrentExercise}
                            removeExercise={handleRemoveExercise}
                        />);
                    handleButtonsToShow(true, true);
                    return;
                }
                case ScreenOptions.CURRENT_EXERCISE: {
                    setCurrentScreen(
                        <MovementList
                            exercises={state.exercises}
                            editable={state.editing}
                            showSets={true}
                            moveExerciseUp={handleMoveExerciseUp}
                            moveExerciseDown={handleMoveExerciseDown}
                            setCurrentExercise={handleSetCurrentExercise}
                            removeExercise={handleRemoveExercise}
                        />);
                    handleButtonsToShow(true, true);
                    return;

                }
                case ScreenOptions.ADD_EXERCISE: {
                    setCurrentScreen(<ExerciseSearch addExercise={handleSelectExercise} />);
                    handleButtonsToShow(false, false);
                    return;
                }
                case ScreenOptions.ADD_SETS: {
                    setCurrentScreen(<AddTemplateSets movement={currentExercise} navigateBack={navigateToMovementList} addSets={handleAddSets} />);
                    handleButtonsToShow(false, false);
                    return;
                }
                default: {
                    setCurrentScreen(<ExerciseSearch addExercise={handleSelectExercise} />);
                    handleButtonsToShow(false, false);
                    return;
                }
            }
        }

    }, [state.screen, state.exercises, state.current_exercise, state.editing]);

    useEffect(() => {
        if (workoutMutationResult.error) {
            console.log(workoutMutationResult.error);
        }
    }, [workoutMutationResult]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                ...baseStyles.container,
                backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
            }}>
                <View style={baseStyles.container}>
                    <View style={baseStyles.screenContainer}>
                        {currentScreen}
                    </View>
                    <View style={baseStyles.buttonContainer}>
                        <TemplateButtons
                            state={state.buttons}
                            addExercisePressed={addExercisePressed}
                            editMovementsPressed={handleEditMovements}
                            saveTemplatePressed={handleSaveTemplate}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
