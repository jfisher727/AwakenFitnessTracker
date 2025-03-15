import { ExerciseProps } from "./properties"

export type workoutStateProps = {
    screen: string,
    template_id: string,
    exercises: ExerciseProps[],
}

const ActionTypes = {
    ADD_EXERCISE: 'ADD_EXERCISE',
    SET_EXERCISES: 'SET_EXERCISES',
    REMOVE_EXERCISE: 'REMOVE_EXERCISE',
    CHANGE_SCREEN: 'CHANGE_SCREEN'
}

interface AddExerciseAction {
    type: typeof ActionTypes.ADD_EXERCISE,
    payload: ExerciseProps
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


type WorkoutActions = AddExerciseAction | SetExercisesAction | RemoveExerciseAction | ChangeScreenAction;

export function workoutStateReducer(state: workoutStateProps, action: WorkoutActions): workoutStateProps {
    switch (action.type) {
        case ActionTypes.ADD_EXERCISE: {
            console.log('added exercise');
            return {
                ...state,
                exercises: [
                    ...state.exercises
                ]
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
            console.log('change screen');
            return state;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
