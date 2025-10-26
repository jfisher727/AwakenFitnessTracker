import { useEffect } from "react";
import { View, Pressable, Text, FlatList, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useWorkoutPlansLazyQuery, WorkoutPlanNodeEdge } from "@/graphql/types";

import Spinner from "@/components/general/spinner";

import { baseStyles, lightColors, darkColors } from "@/styles/global";
import HorzontalLine from "@/components/general/horizonal_line";

function WorkoutPlanEntry(node: WorkoutPlanNodeEdge, color: string) {
    console.log(color);
    return (
        <View style={baseStyles.spacedRow}>
            <Text style={{ ...baseStyles.text, color: color }}>
                {node.node?.name}
            </Text>
            <Text style={{ ...baseStyles.text, color: color }}>
                {node.node?.planType}
            </Text>
        </View>
    );
}

export default function ListPrograms() {
    const colorScheme = useColorScheme();

    const [execute, { loading, error, data }] = useWorkoutPlansLazyQuery();

    useEffect(() => {
        execute({ variables: { count: 20 } });
    }, []);

    function navigateBack() {
        router.navigate("/(tabs)/management/programs");
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
                <Pressable
                    onPress={navigateBack}
                    style={baseStyles.leftJustifiedRow}
                >
                    <FontAwesome
                        size={28}
                        name="chevron-left"
                        color={textColor}
                    />
                    <Text style={{ ...baseStyles.text, color: textColor }}>
                        Programs
                    </Text>
                </Pressable>
                <View style={baseStyles.modal}>
                    <Text
                        style={{
                            ...baseStyles.subHeader,
                            color:
                                colorScheme === "light"
                                    ? lightColors.primaryColor
                                    : darkColors.primaryColor,
                        }}
                    >
                        Your Workout Programs
                    </Text>
                    {loading && <Spinner />}
                    {data && (
                        <>
                            <HorzontalLine />
                            <FlatList
                                data={data.workoutPlans?.edges}
                                renderItem={(item) => (
                                    <WorkoutPlanEntry
                                        node={item.item?.node}
                                        color={textColor}
                                    />
                                )}
                                keyExtractor={(item) => String(item?.node?.id)}
                            />
                        </>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
