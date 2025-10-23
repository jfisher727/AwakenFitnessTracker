import { useState, useEffect, useReducer } from "react";
import { View, Text, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import { useGetWorkoutTemplatesQuery } from "@/graphql/types";

import CustomButton from "@/components/general/button";
import Spinner from "@/components/general/spinner";
import HorzontalLine from "@/components/general/horizonal_line";

import {
    workoutPlanReducer,
    workoutPlanProps,
    ActionTypes,
    ScreenOptions,
} from "@/state/WorkoutPlanReducer";

import PlanDetails from "@/components/plan/details";
import DayPlanner from "@/components/plan/day_planner";
import PlanReview from "@/components/plan/review";

export default function CreateProgram() {
    const colorScheme = useColorScheme();

    const { data, loading, error } = useGetWorkoutTemplatesQuery({
        variables: { count: 20, template: true },
    });

    const INITIAL_STATE: workoutPlanProps = {
        screen: ScreenOptions.DETAILS,
        days: [],
        name: "",
        type: "",
        currentDay: 1,
    };

    const [state, dispatch] = useReducer(workoutPlanReducer, INITIAL_STATE);

    // lets leverage a flat list of selection days based the number of days the
    // user has selected

    if (loading) {
        return <Spinner />;
    }
    if (error) {
        console.log(JSON.stringify(error));
        return <Text>Error</Text>;
    }

    function handleAddDay(
        dayNumber: number,
        workoutOneId: string,
        workoutTwoId?: string,
        workoutThreeId?: string
    ) {
        dispatch({
            type: ActionTypes.ADD_DAY,
            payload: {
                dayNumber: dayNumber,
                sequenceNumber: state.days.length + 1,
                workoutOneId: workoutOneId,
                workoutTwoId: workoutTwoId,
                workoutThreeId: workoutThreeId,
            },
        });
    }

    function handleAddRestDay() {
        dispatch({
            type: ActionTypes.ADD_REST_DAY,
        });
    }

    function handleFinishedPressed() {
        dispatch({
            type: ActionTypes.CHANGE_SCREEN,
            payload: ScreenOptions.REVIEW,
        });
    }

    function handleSavePressed() {}

    function handleSetDetails(name: string, type: string) {
        dispatch({
            type: ActionTypes.SET_DETAILS,
            payload: {
                name: name,
                type: type,
            },
        });
        dispatch({
            type: ActionTypes.CHANGE_SCREEN,
            payload: ScreenOptions.DAYS,
        });
    }

    const textColor =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;

    return (
        <SafeAreaProvider style={baseStyles.parent}>
            <SafeAreaView
                style={{
                    ...baseStyles.container,
                    backgroundColor:
                        colorScheme === "light"
                            ? lightColors.background
                            : darkColors.background,
                }}
            >
                <View style={baseStyles.modal}>
                    {state.screen === ScreenOptions.DETAILS && (
                        <>
                            <Text
                                style={{
                                    ...baseStyles.mediumHeader,
                                    color: textColor,
                                }}
                            >
                                Create a
                            </Text>
                            <Text
                                style={{
                                    ...baseStyles.mediumHeader,
                                    color: textColor,
                                }}
                            >
                                Workout Program
                            </Text>
                            <HorzontalLine />
                            <PlanDetails
                                name={state.name}
                                type={state.type}
                                setDetails={handleSetDetails}
                            />
                        </>
                    )}
                    {state.screen === ScreenOptions.DAYS && (
                        <>
                            <Text
                                style={{
                                    ...baseStyles.header,
                                    color: textColor,
                                }}
                            >
                                Add Workouts
                            </Text>
                            <HorzontalLine />
                            <DayPlanner
                                templates={data?.workouts?.edges}
                                day_number={state.currentDay}
                                save_day={handleAddDay}
                                add_rest_day={handleAddRestDay}
                            />
                            <View style={{ marginTop: 50 }}>
                                <HorzontalLine />
                                <CustomButton
                                    text="Finished Adding Days"
                                    onPress={handleFinishedPressed}
                                    disabled={false}
                                />
                            </View>
                        </>
                    )}
                    {state.screen === ScreenOptions.REVIEW && (
                        <>
                            <Text
                                style={{
                                    ...baseStyles.header,
                                    color: textColor,
                                }}
                            >
                                Review
                            </Text>
                            <PlanReview />
                            <CustomButton
                                text="Save Plan"
                                onPress={handleSavePressed}
                                disabled={false}
                            />
                        </>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
