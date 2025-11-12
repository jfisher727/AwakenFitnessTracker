import { useEffect } from "react";
import { View, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import { useGetWorkoutTemplatesLazyQuery } from "@/graphql/types";

import Spinner from "@/components/general/spinner";
import NavigateBack from "@/components/general/navigate_back";

import WorkoutList from "@/components/workout/workout_list";

export default function List() {
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
                        <WorkoutList
                            workouts={data.workouts.edges}
                            start_workout_enabled={false}
                        />
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
