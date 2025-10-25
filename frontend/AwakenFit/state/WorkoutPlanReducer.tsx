import { WorkoutDayInput } from "@/graphql/types";

export type workoutPlanProps = {
    screen: string;
    days: WorkoutDayInput[];
    name: string;
    type: string;
    currentDay: number;
};

export const ActionTypes = {
    SET_DETAILS: "SET_DETAILS",
    CHANGE_SCREEN: "CHANGE_SCREEN",
    ADD_DAY: "ADD_DAY",
    ADD_REST_DAY: "ADD_REST_DAY",
    REMOVE_DAY: "REMOVE_DAY",
};

export const ScreenOptions = {
    DETAILS: "DETAILS",
    DAYS: "DAYS",
    REVIEW: "REVIEW",
};

interface SetDetailsAction {
    type: typeof ActionTypes.SET_DETAILS;
    payload: {
        name: string;
        type: string;
    };
}

interface ChangeScreenAction {
    type: typeof ActionTypes.CHANGE_SCREEN;
    payload: string;
}

interface AddDayAction {
    type: typeof ActionTypes.ADD_DAY;
    payload: WorkoutDayInput;
}

interface AddRestDayAction {
    type: typeof ActionTypes.ADD_REST_DAY;
}

interface RemoveDayAction {
    type: typeof ActionTypes.REMOVE_DAY;
    payload: number;
}

type WorkoutPlanActions =
    | SetDetailsAction
    | ChangeScreenAction
    | AddDayAction
    | AddRestDayAction
    | RemoveDayAction;

export function workoutPlanReducer(
    state: workoutPlanProps,
    action: WorkoutPlanActions
): workoutPlanProps {
    switch (action.type) {
        case ActionTypes.SET_DETAILS: {
            const payload = (action as SetDetailsAction).payload;
            return {
                ...state,
                name: payload.name,
                type: payload.type,
            };
        }
        case ActionTypes.CHANGE_SCREEN: {
            const payload = (action as ChangeScreenAction).payload;
            return {
                ...state,
                screen: payload,
            };
        }
        case ActionTypes.ADD_DAY: {
            const payload = (action as AddDayAction).payload;
            const days = state.days;
            days.push(payload);
            return {
                ...state,
                days: days,
                currentDay: state.currentDay + 1,
            };
        }
        case ActionTypes.ADD_REST_DAY: {
            return {
                ...state,
                currentDay: state.currentDay + 1,
            };
        }
        case ActionTypes.REMOVE_DAY: {
            const payload = (action as RemoveDayAction).payload;
            const days = state.days;
            days.splice(payload, 1);
            return {
                ...state,
                days: days,
            };
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
}
