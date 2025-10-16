import { Text, View, useColorScheme } from "react-native";

import { useWeekInReviewQuery } from "@/graphql/types";

import Spinner from "./general/spinner";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

export default function WeekReview() {
    const colorScheme = useColorScheme();
    const headerColor =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;
    const secondaryColor =
        colorScheme === "light"
            ? lightColors.secondaryColor
            : darkColors.secondaryColor;

    const { loading, error, data } = useWeekInReviewQuery({
        fetchPolicy: "no-cache",
    });

    if (error) {
        console.log(error);
        return (
            <View>
                <Text
                    style={{
                        ...baseStyles.subHeader,
                        color: headerColor,
                    }}
                >
                    Week in Review
                </Text>
                <Text>Error</Text>
            </View>
        );
    }

    return (
        <View>
            <Text
                style={{
                    ...baseStyles.subHeader,
                    color: headerColor,
                }}
            >
                Week in Review
            </Text>
            {loading && <Spinner />}
            {data && data?.weekInReview?.message === "N/A" && (
                <View>
                    <View style={baseStyles.spacedRow}>
                        <Text
                            style={{
                                ...baseStyles.text,
                                color: secondaryColor,
                            }}
                        >
                            Total Workouts:
                        </Text>
                        <Text
                            style={{
                                ...baseStyles.text,
                                color: secondaryColor,
                            }}
                        >
                            {data.weekInReview.totalWorkouts}
                        </Text>
                    </View>
                    <View style={baseStyles.spacedRow}>
                        <Text
                            style={{
                                ...baseStyles.text,
                                color: secondaryColor,
                            }}
                        >
                            Total Duration:
                        </Text>
                        <Text
                            style={{
                                ...baseStyles.text,
                                color: secondaryColor,
                            }}
                        >
                            {data.weekInReview.totalWorkoutDuration}
                        </Text>
                    </View>
                    <View style={baseStyles.spacedRow}>
                        <Text
                            style={{
                                ...baseStyles.text,
                                color: secondaryColor,
                            }}
                        >
                            Total Volume:
                        </Text>
                        <Text
                            style={{
                                ...baseStyles.text,
                                color: secondaryColor,
                            }}
                        >
                            {data.weekInReview.totalVolume}
                        </Text>
                    </View>
                    <View style={baseStyles.spacedRow}>
                        <Text
                            style={{
                                ...baseStyles.text,
                                color: secondaryColor,
                            }}
                        >
                            Top Muscle Group:
                        </Text>
                        <Text
                            style={{
                                ...baseStyles.text,
                                color: secondaryColor,
                            }}
                        >
                            {data.weekInReview.topMuscleGroup}
                        </Text>
                    </View>
                    <View style={baseStyles.spacedRow}>
                        <Text
                            style={{
                                ...baseStyles.text,
                                color: secondaryColor,
                            }}
                        >
                            Favorite Equipment:
                        </Text>
                        <Text
                            style={{
                                ...baseStyles.text,
                                color: secondaryColor,
                            }}
                        >
                            {data.weekInReview.favoriteEquipment}
                        </Text>
                    </View>
                </View>
            )}
            {data && data?.weekInReview?.message !== "N/A" && (
                <Text>{data?.weekInReview?.message}</Text>
            )}
        </View>
    );
}
