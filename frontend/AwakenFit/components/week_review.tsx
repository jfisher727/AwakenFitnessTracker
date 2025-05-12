import { Text, View, useColorScheme } from 'react-native';

import { gql, useQuery } from '@apollo/client';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

const GET_WEEK_IN_REVIEW = gql`
    query {
        weekInReview {
            message
            totalWorkouts
            totalVolume
            topMuscleGroup
            totalCardio
            favoriteEquipment
        }
    }
`;

export default function WeekReview() {
    const colorScheme = useColorScheme();

    const { loading, error, data } = useQuery(GET_WEEK_IN_REVIEW);

    if (error) {
        console.log(error);
    }
    if (loading) {
        return (
            <View>
                <Text
                    style={{
                        ...baseStyles.subHeader,
                        color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                    }}>
                    Week in Review
                    <Text>Loading</Text>
                </Text>
            </View>
        );
    }

    if (data) {
        if (data.message === "N/A") {
            return (
                <View>
                    <Text
                        style={{
                            ...baseStyles.subHeader,
                            color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                        }}>
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
        else {
            return (
                <View>
                    <Text
                        style={{
                            ...baseStyles.subHeader,
                            color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                        }}>
                        Week in Review
                    </Text>
                    <Text>{data.weekInReview.message}</Text>
                </View>
            );
        }
    }
}
