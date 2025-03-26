import { ExerciseProps, SetNode } from "./properties"

export type workoutStateProps = {
    screen: string,
    template_id: string,
    start_time: string,
    stop_time: string,
    current_exercise: string,
    exercises: ExerciseProps[],
    buttons: {
        historical: boolean,
        end_workout: boolean,
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
    UPDATE_BUTTONS: 'UPDATE_BUTTONS'
}

export const ScreenOptions = {
    MOVEMENT_LIST: 'MOVEMENT_LIST',
    ADD_EXERCISE: 'ADD_EXERCISE',
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
        duration?: number
    }
}

interface UpdateButtonsAction {
    type: typeof ActionTypes.UPDATE_BUTTONS
    payload: {
        historical: boolean,
        add_exercise: boolean,
        end_workout: boolean,
        add_set: boolean
    }
}


type WorkoutActions = (
    AddExerciseAction | AddSetsAction | SetStopTimeAction | SetExercisesAction | RemoveExerciseAction |
    ChangeScreenAction | SetCurrentExerciseAction | RecordSetAction | UpdateButtonsAction
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
                    const updatedSets = [...exercise.sets];
                    const existingSets = updatedExercises.length();
                    for (var index = 1; index <= sets; index++) {
                        const sequence_number = existingSets + index;
                        updatedSets.concat({
                            id: 'addedSet' + sequence_number,
                            sequenceNumber: sequence_number,
                            minReps: 0,
                            maxReps: 0,
                            setType: 'standard',
                            parentSet: '',
                        });
                    }
                }
            })
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
            console.log('removed exercise');
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
            const { exercise_id, sequence_number, reps, weight, duration } = action.payload;

            const updatedExercises = state.exercises.map((exercise) => {
                if (exercise.id === exercise_id) {
                    // Update the set within the exercise
                    const updatedSets = exercise.sets.map((set) => {
                        if (set.sequenceNumber === sequence_number) {
                            const updatedSet = { ...set };
                            updatedSet.completedReps = reps;
                            updatedSet.weight = weight;
                            updatedSet.duration = duration;

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
        case ActionTypes.UPDATE_BUTTONS: {
            return {
                ...state,
                buttons: {
                    historical: action.payload.historical,
                    add_exercise: action.payload.add_exercise,
                    end_workout: action.payload.end_workout,
                    add_set: action.payload.add_set
                }
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
