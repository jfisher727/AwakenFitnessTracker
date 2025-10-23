import { View, Text, useColorScheme, FlatList } from "react-native";

import { WorkoutDayInput } from "@/graphql/types";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

type DayPlanParams = {
    day: WorkoutDayInput;
};

function DayPlan({ day }: DayPlanParams) {
    return (
        <View>
            <Text>Day {day.dayNumber}</Text>
            <Text>Workout 1: {day.workoutOneId}</Text>
            {day.workoutTwoId && <Text>Workout 2: {day.workoutTwoId}</Text>}
            {day.workoutThreeId && <Text>Workout 3: {day.workoutThreeId}</Text>}
        </View>
    );
}

type params = {
    name: string;
    type: string;
    days: WorkoutDayInput[];
};

export default function PlanReview({ name, type, days }: params) {
    const colorScheme = useColorScheme();

    const textColor =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;
    return (
        <View>
            <Text>Name: {name}</Text>
            <Text>Type: {type}</Text>
            <FlatList
                data={days}
                renderItem={({ item }) => <DayPlan day={item} />}
                keyExtractor={(item) => String(item.dayNumber)}
            />
        </View>
    );
}
