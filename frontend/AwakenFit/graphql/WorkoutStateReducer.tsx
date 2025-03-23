import { ExerciseProps, SetNode } from "./properties"

export type workoutStateProps = {
    screen: string,
    template_id: string,
    start_time: string,
    stop_time: string,
    current_exercise: string,
    exercises: ExerciseProps[],
}

export const ActionTypes = {
    ADD_EXERCISE: 'ADD_EXERCISE',
    SET_EXERCISES: 'SET_EXERCISES',
    SET_STOP_TIME: 'SET_STOP_TIME',
    REMOVE_EXERCISE: 'REMOVE_EXERCISE',
    CHANGE_SCREEN: 'CHANGE_SCREEN',
    SET_CURRENT_EXERCISE: 'SET_CURRENT_EXERCISE',
    RECORD_SET: 'RECORD_SET'
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


type WorkoutActions = AddExerciseAction | SetStopTimeAction | SetExercisesAction | RemoveExerciseAction | ChangeScreenAction | SetCurrentExerciseAction | RecordSetAction;

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
        case ActionTypes.SET_STOP_TIME: {
            return {
                ...state,
                stop_time: action.payload
            }
        }
        case ActionTypes.SET_EXERCISES: {
            console.log('set exercises');
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
            console.log('change screen payload:');
            console.log(action.payload);
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
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
