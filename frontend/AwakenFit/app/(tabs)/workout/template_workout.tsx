import { useEffect } from "react";
import { View, Text, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import { useGetWorkoutTemplatesLazyQuery } from "@/graphql/types";

import Spinner from "@/components/general/spinner";
import NavigateBack from "@/components/general/navigate_back";

import WorkoutList from "@/components/workout/workout_list";

export default function TemplateWorkout() {
    const [execute, { loading, error, data }] =
        useGetWorkoutTemplatesLazyQuery();
    const colorScheme = useColorScheme();

    useEffect(() => {
        execute({ variables: { count: 20, template: true } });
    }, []);

    if (error) {
        console.log(error);
    }

    function handleNavigateBack() {
        router.back();
    }

    const textColor =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;

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
                <NavigateBack label="Back" onPress={handleNavigateBack} />
                <View style={baseStyles.modal}>
                    {loading && <Spinner />}
                    {data && (
                        <>
                            <Text
                                style={{
                                    ...baseStyles.subHeader,
                                    color: textColor,
                                }}
                            >
                                Your Workout Templates
                            </Text>
                            <WorkoutList
                                workouts={data?.workouts?.edges}
                                start_workout_enabled={true}
                            />
                        </>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
