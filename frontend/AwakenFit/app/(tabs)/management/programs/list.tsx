import { useEffect, useState } from "react";
import { View, Pressable, Text, FlatList, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useWorkoutPlansLazyQuery, WorkoutPlanNode } from "@/graphql/types";

import Spinner from "@/components/general/spinner";

import { baseStyles, lightColors, darkColors } from "@/styles/global";
import CustomButton from "@/components/general/button";
import NavigateBack from "@/components/general/navigate_back";

type params = {
    node: WorkoutPlanNode;
    color: string;
};

function WorkoutPlanEntry({ node, color }: params) {
    const [expanded, setExpanded] = useState(false);

    function toggleExpand() {
        setExpanded(!expanded);
    }

    return (
        <>
            <CustomButton
                text={node.name}
                onPress={toggleExpand}
                disabled={false}
            />
            {expanded && (
                <View>
                    <Text>Type: {node.planType}</Text>
                    {node.workoutDays && (
                        <Text>Day Count: {node.workoutDays?.length}</Text>
                    )}
                </View>
            )}
        </>
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
                <NavigateBack label="Programs" onPress={navigateBack} />
                <View style={baseStyles.modal}>
                    <Text
                        style={{
                            ...baseStyles.subHeader,
                            color: textColor,
                        }}
                    >
                        Your Workout Programs
                    </Text>
                    {loading && <Spinner />}
                    {data && (
                        <FlatList
                            data={data.workoutPlans?.edges}
                            renderItem={({ item }) => (
                                <WorkoutPlanEntry
                                    node={item?.node}
                                    color={textColor}
                                />
                            )}
                            keyExtractor={(item) => String(item?.node?.id)}
                        />
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
