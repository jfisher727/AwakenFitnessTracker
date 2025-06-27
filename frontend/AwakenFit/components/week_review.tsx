import { Text, View, useColorScheme } from "react-native";

import { useWeekInReviewQuery } from "@/graphql/types";

import Spinner from "./general/spinner";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

export default function WeekReview() {
    const colorScheme = useColorScheme();

    const { loading, error, data } = useWeekInReviewQuery({
        fetchPolicy: "no-cache",
    });

    if (error) {
        console.log(error);
    }
    if (loading) {
        return (
            <View>
                <Text
                    style={{
                        ...baseStyles.subHeader,
                        color:
                            colorScheme === "light"
                                ? lightColors.primaryColor
                                : darkColors.primaryColor,
                    }}
                >
                    Week in Review
                    <Text>Loading</Text>
                </Text>
            </View>
        );
    }

    if (data && data?.weekInReview?.message === "N/A") {
        return (
            <View>
                <Text
                    style={{
                        ...baseStyles.subHeader,
                        color:
                            colorScheme === "light"
                                ? lightColors.primaryColor
                                : darkColors.primaryColor,
                    }}
                >
                    Week in Review
                </Text>
                <View>
                    <View>
                        <Text>Total Workouts:</Text>
                        <Text>{data.weekInReview.totalWorkouts}</Text>
                    </View>
                    <View>
                        <Text>Total Volume:</Text>
                        <Text>{data.weekInReview.totalVolume}</Text>
                    </View>
                    <View>
                        <Text>Top Muscle Group:</Text>
                        <Text>{data.weekInReview.topMuscleGroup}</Text>
                    </View>
                    <View>
                        <Text>Favorite Equipment:</Text>
                        <Text>{data.weekInReview.favoriteEquipment}</Text>
                    </View>
                </View>
            </View>
        );
    }
    return (
        <View>
            <Text
                style={{
                    ...baseStyles.subHeader,
                    color:
                        colorScheme === "light"
                            ? lightColors.primaryColor
                            : darkColors.primaryColor,
                }}
            >
                Week in Review
            </Text>
            {loading && <Spinner />}
            {data && <Text>{data?.weekInReview?.message}</Text>}
        </View>
    );
}
