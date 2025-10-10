import { SetNode, ExerciseNode } from "./types";

export type workoutStateProps = {
    screen: string;
    template_id: string;
    start_time: string;
    stop_time: string;
    current_exercise: string;
    exercises: ExerciseNode[];
    editing: boolean;
    buttons: {
        historical: boolean;
        end_workout: boolean;
        edit_movements: boolean;
        add_exercise: boolean;
        add_set: boolean;
        notes: boolean;
    };
};

export const ActionTypes = {
    LOAD_STATE: "LOAD_STATE",
    ADD_EXERCISE: "ADD_EXERCISE",
    ADD_SETS: "ADD_SETS",
    SET_EXERCISES: "SET_EXERCISES",
    SET_STOP_TIME: "SET_STOP_TIME",
    REMOVE_EXERCISE: "REMOVE_EXERCISE",
    CHANGE_SCREEN: "CHANGE_SCREEN",
    SET_CURRENT_EXERCISE: "SET_CURRENT_EXERCISE",
    RECORD_SET: "RECORD_SET",
    EDIT_MOVEMENTS: "EDIT_MOVEMENTS",
    MOVE_EXERCISE_UP: "MOVE_EXERCISE_UP",
    MOVE_EXERCISE_DOWN: "MOVE_EXERCISE_DOWN",
    UPDATE_BUTTONS: "UPDATE_BUTTONS",
    RESET_WORKOUT_STATE: "RESET_WORKOUT_STATE",
};

export const ScreenOptions = {
    MOVEMENT_LIST: "MOVEMENT_LIST",
    ADD_EXERCISE: "ADD_EXERCISE",
    ADD_SETS: "ADD_SETS",
    CURRENT_EXERCISE: "CURRENT_EXERCISE",
    HISTORICAL: "HISTORICAL",
    WORKOUT_REVIEW: "WORKOUT_REVIEW",
    NOTES: "NOTES",
};

interface LoadStateAction {
    type: typeof ActionTypes.LOAD_STATE;
    payload: workoutStateProps;
}

interface AddExerciseAction {
    type: typeof ActionTypes.ADD_EXERCISE;
    payload: ExerciseNode;
}

interface AddSetsAction {
    type: typeof ActionTypes.ADD_SETS;
    payload: {
        exercise_id: string;
        sets: number;
    };
}

interface SetStopTimeAction {
    type: typeof ActionTypes.SET_STOP_TIME;
    payload: string;
}

interface SetExercisesAction {
    type: typeof ActionTypes.SET_EXERCISES;
    payload: ExerciseNode[];
}

interface RemoveExerciseAction {
    type: typeof ActionTypes.REMOVE_EXERCISE;
    payload: string;
}

interface ChangeScreenAction {
    type: typeof ActionTypes.CHANGE_SCREEN;
    payload: {
        name: string;
        template_id?: string;
    };
}

interface SetCurrentExerciseAction {
    type: typeof ActionTypes.SET_CURRENT_EXERCISE;
    payload: string;
}

interface RecordSetAction {
    type: typeof ActionTypes.RECORD_SET;
    payload: {
        exercise_id: string;
        sequence_number: number;
        reps?: number;
        weight?: number;
        duration?: string;
        equipment_identifier?: string;
    };
}

interface EditMovementsAction {
    type: typeof ActionTypes.EDIT_MOVEMENTS;
    payload: boolean;
}

interface MoveExerciseUpAction {
    type: typeof ActionTypes.MOVE_EXERCISE_UP;
    payload: number;
}

interface MoveExerciseDownAction {
    type: typeof ActionTypes.MOVE_EXERCISE_DOWN;
    payload: number;
}

interface UpdateButtonsAction {
    type: typeof ActionTypes.UPDATE_BUTTONS;
    payload: {
        historical: boolean;
        add_exercise: boolean;
        end_workout: boolean;
        edit_movements: boolean;
        add_set: boolean;
        notes: boolean;
    };
}

interface ResetStateAction {
    type: typeof ActionTypes.RESET_WORKOUT_STATE;
}

type WorkoutActions =
    | LoadStateAction
    | AddExerciseAction
    | AddSetsAction
    | SetStopTimeAction
    | SetExercisesAction
    | RemoveExerciseAction
    | ChangeScreenAction
    | SetCurrentExerciseAction
    | RecordSetAction
    | UpdateButtonsAction
    | EditMovementsAction
    | MoveExerciseUpAction
    | MoveExerciseDownAction
    | ResetStateAction;

export function workoutStateReducer(
    state: workoutStateProps,
    action: WorkoutActions
): workoutStateProps {
    switch (action.type) {
        case ActionTypes.LOAD_STATE: {
            const payload = (action as LoadStateAction).payload;
            return {
                ...payload,
            };
        }
        case ActionTypes.ADD_EXERCISE: {
            const payload = (action as AddExerciseAction).payload;
            const currentExercises = state.exercises;
            const updatedExercises = currentExercises.concat(payload);
            return {
                ...state,
                current_exercise: payload.id,
                exercises: updatedExercises,
                screen: ScreenOptions.CURRENT_EXERCISE,
            };
        }
        case ActionTypes.ADD_SETS: {
            const { exercise_id, sets } = (action as AddSetsAction).payload;

            const updatedExercises = state.exercises.map((exercise) => {
                if (exercise.id === exercise_id) {
                    var currentSets: SetNode[] = (exercise.sets ?? []).filter(
                        Boolean
                    ) as SetNode[];
                    const existingSets = currentSets.length;
                    for (var index = 1; index <= sets; index++) {
                        const sequence_number = existingSets + index;
                        var newSet: SetNode = {
                            id: "addedSet" + sequence_number,
                            sequenceNumber: sequence_number,
                            minReps: 0,
                            maxReps: 0,
                            setType: "standard",
                            duration: "",
                            exercise: null,
                            completedReps: 0,
                            equipmentIdentifier: "",
                            weight: 0,
                        };
                        currentSets.push(newSet);
                    }
                    return {
                        ...exercise,
                        sets: currentSets,
                    };
                }
                return exercise;
            });
            return {
                ...state,
                exercises: updatedExercises,
            };
        }
        case ActionTypes.SET_STOP_TIME: {
            const payload = (action as SetStopTimeAction).payload;
            return {
                ...state,
                stop_time: payload,
            };
        }
        case ActionTypes.SET_EXERCISES: {
            const payload = (action as SetExercisesAction).payload;
            return {
                ...state,
                exercises: payload,
            };
        }
        case ActionTypes.REMOVE_EXERCISE: {
            var updated_exercises = state.exercises.filter(
                (e) => e.id !== action.payload
            );
            return {
                ...state,
                exercises: updated_exercises,
            };
        }
        case ActionTypes.CHANGE_SCREEN: {
            const payload = (action as ChangeScreenAction).payload;
            return {
                ...state,
                screen: payload.name,
            };
        }
        case ActionTypes.SET_CURRENT_EXERCISE: {
            const payload = (action as SetCurrentExerciseAction).payload;
            return {
                ...state,
                current_exercise: payload,
            };
        }
        case ActionTypes.RECORD_SET: {
            const {
                exercise_id,
                sequence_number,
                reps,
                weight,
                duration,
                equipment_identifier,
            } = (action as RecordSetAction).payload;
            const updatedExercises = state.exercises.map((exercise) => {
                if (exercise.id === exercise_id) {
                    // Update the set within the exercise
                    const updatedSets: SetNode[] = (exercise.sets ?? [])
                        .filter(Boolean)
                        .map((set) => {
                            if (set?.sequenceNumber === sequence_number) {
                                return {
                                    ...set,
                                    completedReps: reps,
                                    weight: weight,
                                    duration: duration,
                                    equipmentIdentifier: equipment_identifier,
                                };
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
            const payload = (action as EditMovementsAction).payload;
            return {
                ...state,
                editing: payload,
            };
        }
        case ActionTypes.MOVE_EXERCISE_UP: {
            const index = (action as MoveExerciseUpAction).payload;
            if (index == 0) {
                return state;
            }

            const newExercises = [...state.exercises];
            [newExercises[index - 1], newExercises[index]] = [
                newExercises[index],
                newExercises[index - 1],
            ];
            return {
                ...state,
                exercises: newExercises,
            };
        }
        case ActionTypes.MOVE_EXERCISE_DOWN: {
            const index = (action as MoveExerciseDownAction).payload;
            if (index == state.exercises.length - 1) {
                return state;
            }

            const newExercises = [...state.exercises];
            [newExercises[index], newExercises[index + 1]] = [
                newExercises[index + 1],
                newExercises[index],
            ];
            return {
                ...state,
                exercises: newExercises,
            };
        }
        case ActionTypes.UPDATE_BUTTONS: {
            const payload = (action as UpdateButtonsAction).payload;
            return {
                ...state,
                buttons: {
                    historical: payload.historical,
                    add_exercise: payload.add_exercise,
                    end_workout: payload.end_workout,
                    edit_movements: payload.edit_movements,
                    add_set: payload.add_set,
                    notes: payload.notes,
                },
            };
        }
        case ActionTypes.RESET_WORKOUT_STATE: {
            return {
                screen: "blank",
                template_id: "",
                start_time: "",
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
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
}
