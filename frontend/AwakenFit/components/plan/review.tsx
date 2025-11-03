import { View, Text, useColorScheme, FlatList } from "react-native";

import { WorkoutDayInput, WorkoutNodeEdge } from "@/graphql/types";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import HorzontalLine from "../general/horizonal_line";
import CustomButton from "../general/button";

type DayPlanParams = {
    day: WorkoutDayInput;
    templates: WorkoutNodeEdge[];
    textColor: string;
};

function convertIdToName(id: string, templates: WorkoutNodeEdge[]) {
    return templates.find((entry) => entry.node?.id === id)?.node?.name;
}

function DayPlan({ day, templates, textColor }: DayPlanParams) {
    return (
        <View>
            <Text style={{ ...baseStyles.text, color: textColor }}>
                Day {day.dayNumber}
            </Text>
            {day.restDay && (
                <Text style={{ ...baseStyles.text, color: textColor }}>
                    Rest Day
                </Text>
            )}
            {day.workoutOneId && (
                <Text style={{ ...baseStyles.text, color: textColor }}>
                    Workout 1: {convertIdToName(day.workoutOneId, templates)}
                </Text>
            )}
            {day.workoutTwoId && (
                <Text style={{ ...baseStyles.text, color: textColor }}>
                    Workout 2: {convertIdToName(day.workoutTwoId, templates)}
                </Text>
            )}
            {day.workoutThreeId && (
                <Text style={{ ...baseStyles.text, color: textColor }}>
                    Workout 3: {convertIdToName(day.workoutThreeId, templates)}
                </Text>
            )}
        </View>
    );
}

type params = {
    name: string;
    type: string;
    days: WorkoutDayInput[];
    templates: WorkoutNodeEdge[];
    handleSavePressed: () => void;
};

export default function PlanReview({
    name,
    type,
    days,
    templates,
    handleSavePressed,
}: params) {
    const colorScheme = useColorScheme();

    const textColor =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;
    return (
        <View>
            <Text
                style={{
                    ...baseStyles.subHeader,
                    color: textColor,
                    fontWeight: "bold",
                }}
            >
                Review Your
            </Text>
            <Text
                style={{
                    ...baseStyles.subHeader,
                    color: textColor,
                    fontWeight: "bold",
                }}
            >
                Workout Plan
            </Text>
            <HorzontalLine />
            <View style={baseStyles.spacedRow}>
                <Text
                    style={{
                        ...baseStyles.text,
                        color: textColor,
                        fontWeight: "bold",
                    }}
                >
                    Name:
                </Text>
                <Text style={{ ...baseStyles.text, color: textColor }}>
                    {name}
                </Text>
            </View>
            <View style={baseStyles.spacedRow}>
                <Text
                    style={{
                        ...baseStyles.text,
                        color: textColor,
                        fontWeight: "bold",
                    }}
                >
                    Type:
                </Text>
                <Text style={{ ...baseStyles.text, color: textColor }}>
                    {type}
                </Text>
            </View>
            <Text
                style={{
                    ...baseStyles.text,
                    color: textColor,
                    fontWeight: "bold",
                }}
            >
                Planned Workouts
            </Text>
            <FlatList
                data={days}
                renderItem={({ item }) => (
                    <DayPlan
                        day={item}
                        templates={templates}
                        textColor={textColor}
                    />
                )}
                keyExtractor={(item) => String(item.dayNumber)}
                ItemSeparatorComponent={HorzontalLine}
                style={{ height: "50%" }}
            />
            <CustomButton
                text="Save Plan"
                onPress={handleSavePressed}
                disabled={false}
            />
        </View>
    );
}
