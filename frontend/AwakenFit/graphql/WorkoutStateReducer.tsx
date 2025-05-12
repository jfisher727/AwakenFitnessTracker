import { act } from "react"
import { ExerciseProps, SetNode } from "./properties"

export type workoutStateProps = {
    screen: string,
    template_id: string,
    start_time: string,
    stop_time: string,
    current_exercise: string,
    exercises: ExerciseProps[],
    editing: boolean,
    buttons: {
        historical: boolean,
        end_workout: boolean,
        edit_movements: boolean,
        add_exercise: boolean,
        add_set: boolean
    }
}

export const ActionTypes = {
    ADD_EXERCISE: 'ADD_EXERCISE',
    ADD_SETS: 'ADD_SETS',
    SET_EXERCISES: 'SET_EXERCISES',
    SET_STOP_TIME: 'SET_STOP_TIME',
    REMOVE_EXERCISE: 'REMOVE_EXERCISE',
    CHANGE_SCREEN: 'CHANGE_SCREEN',
    SET_CURRENT_EXERCISE: 'SET_CURRENT_EXERCISE',
    RECORD_SET: 'RECORD_SET',
    EDIT_MOVEMENTS: 'EDIT_MOVEMENTS',
    MOVE_EXERCISE_UP: 'MOVE_EXERCISE_UP',
    MOVE_EXERCISE_DOWN: 'MOVE_EXERCISE_DOWN',
    UPDATE_BUTTONS: 'UPDATE_BUTTONS'
}

export const ScreenOptions = {
    MOVEMENT_LIST: 'MOVEMENT_LIST',
    ADD_EXERCISE: 'ADD_EXERCISE',
    ADD_SETS: 'ADD_SETS',
    CURRENT_EXERCISE: 'CURRENT_EXERCISE',
    HISTORICAL: 'HISTORICAL',
    WORKOUT_REVIEW: 'WORKOUT_REVIEW'
}

interface AddExerciseAction {
    type: typeof ActionTypes.ADD_EXERCISE,
    payload: ExerciseProps
}

interface AddSetsAction {
    type: typeof ActionTypes.ADD_SETS,
    payload: {
        exercise_id: string,
        sets: number
    }
}

interface SetStopTimeAction {
    type: typeof ActionTypes.SET_STOP_TIME,
    payload: string
}

interface SetExercisesAction {
    type: typeof ActionTypes.SET_EXERCISES,
    payload: ExerciseProps[]
}

interface RemoveExerciseAction {
    type: typeof ActionTypes.REMOVE_EXERCISE,
    payload: string
}

interface ChangeScreenAction {
    type: typeof ActionTypes.CHANGE_SCREEN
    payload: {
        name: string,
        template_id?: string
    }
}

interface SetCurrentExerciseAction {
    type: typeof ActionTypes.SET_CURRENT_EXERCISE
    payload: string
}

interface RecordSetAction {
    type: typeof ActionTypes.RECORD_SET
    payload: {
        exercise_id: string,
        sequence_number: number,
        reps?: number,
        weight?: number,
        duration?: string,
        equipment_identifier?: string,
    }
}

interface EditMovementsAction {
    type: typeof ActionTypes.EDIT_MOVEMENTS
    payload: boolean
}

interface MoveExerciseUpAction {
    type: typeof ActionTypes.MOVE_EXERCISE_UP
    payload: number
}

interface MoveExerciseDownAction {
    type: typeof ActionTypes.MOVE_EXERCISE_DOWN
    payload: number
}

interface UpdateButtonsAction {
    type: typeof ActionTypes.UPDATE_BUTTONS
    payload: {
        historical: boolean,
        add_exercise: boolean,
        end_workout: boolean,
        edit_movements: boolean,
        add_set: boolean
    }
}


type WorkoutActions = (
    AddExerciseAction | AddSetsAction | SetStopTimeAction | SetExercisesAction | RemoveExerciseAction |
    ChangeScreenAction | SetCurrentExerciseAction | RecordSetAction | UpdateButtonsAction | EditMovementsAction |
    MoveExerciseUpAction | MoveExerciseDownAction
);

export function workoutStateReducer(state: workoutStateProps, action: WorkoutActions): workoutStateProps {
    switch (action.type) {
        case ActionTypes.ADD_EXERCISE: {
            const currentExercises = state.exercises;
            const updatedExercises = currentExercises.concat(action.payload);
            return {
                ...state,
                current_exercise: action.payload.id,
                exercises: updatedExercises,
                screen: ScreenOptions.CURRENT_EXERCISE
            }
        }
        case ActionTypes.ADD_SETS: {
            const { exercise_id, sets } = action.payload;

            const updatedExercises = state.exercises.map((exercise) => {
                if (exercise.id === exercise_id) {
                    var updatedSets: SetNode[] = [...exercise.sets];
                    const existingSets = exercise.sets.length;
                    for (var index = 1; index <= sets; index++) {
                        const sequence_number = existingSets + index;
                        var newSet = {
                            id: 'addedSet' + sequence_number,
                            sequenceNumber: sequence_number,
                            minReps: 0,
                            maxReps: 0,
                            setType: 'standard',
                            parentSet: '',
                            duration: '',
                        };
                        updatedSets = [...updatedSets, newSet];
                    }
                    return {
                        ...exercise,
                        sets: updatedSets
                    };
                }
                return exercise;
            });
            return {
                ...state,
                exercises: updatedExercises
            }
        }
        case ActionTypes.SET_STOP_TIME: {
            return {
                ...state,
                stop_time: action.payload
            }
        }
        case ActionTypes.SET_EXERCISES: {
            return {
                ...state,
                exercises: action.payload
            }
        }
        case ActionTypes.REMOVE_EXERCISE: {
            var updated_exercises = state.exercises.filter((e) => e.id !== action.payload);
            return {
                ...state,
                exercises: updated_exercises
            };
        }
        case ActionTypes.CHANGE_SCREEN: {
            return {
                ...state,
                screen: action.payload.name
            };
        }
        case ActionTypes.SET_CURRENT_EXERCISE: {
            return {
                ...state,
                current_exercise: action.payload
            };
        }
        case ActionTypes.RECORD_SET: {
            const { exercise_id, sequence_number, reps, weight, duration, equipment_identifier } = action.payload;

            const updatedExercises = state.exercises.map((exercise) => {
                if (exercise.id === exercise_id) {
                    // Update the set within the exercise
                    const updatedSets = exercise.sets.map((set) => {
                        if (set.sequenceNumber === sequence_number) {
                            const updatedSet = { ...set };
                            updatedSet.completedReps = reps;
                            updatedSet.weight = weight;
                            updatedSet.duration = duration;
                            updatedSet.equipment_identifier = equipment_identifier;

                            return updatedSet;
                        }
                        return set;
                    });

                    // Return the updated exercise
                    return { ...exercise, sets: updatedSets };
                }
                return exercise;
            });

            return {
                ...state,
                exercises: updatedExercises,
            };
        }
        case ActionTypes.EDIT_MOVEMENTS: {
            return {
                ...state,
                editing: action.payload
            };
        }
        case ActionTypes.MOVE_EXERCISE_UP: {
            const index = parseInt(action.payload, 10);
            if (index == 0) {
                return state;
            }

            const newExercises = [...state.exercises];
            [newExercises[index - 1], newExercises[index]] = [newExercises[index], newExercises[index - 1]];
            return {
                ...state,
                exercises: newExercises
            };
        }
        case ActionTypes.MOVE_EXERCISE_DOWN: {
            const index = parseInt(action.payload, 10);
            if (index == state.exercises.length - 1) {
                return state;
            }

            const newExercises = [...state.exercises];
            [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
            return {
                ...state,
                exercises: newExercises
            };
        }
        case ActionTypes.UPDATE_BUTTONS: {
            return {
                ...state,
                buttons: {
                    historical: action.payload.historical,
                    add_exercise: action.payload.add_exercise,
                    end_workout: action.payload.end_workout,
                    edit_movements: action.payload.edit_movements,
                    add_set: action.payload.add_set
                }
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
