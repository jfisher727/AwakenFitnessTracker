import { Text, View, Button, useColorScheme } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import { ExerciseNode } from "@/graphql/types";

import HorzontalLine from "../general/horizonal_line";

type notesParams = {
    exercise: ExerciseNode;
    navigateBack: () => void;
};

export default function Notes({ exercise, navigateBack }: notesParams) {
    const colorScheme = useColorScheme();
    const enabledColor =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;

    function handleNavigateBack() {
        navigateBack();
    }

    return (
        <View>
            <View style={baseStyles.leftJustifiedRow}>
                <FontAwesome
                    size={28}
                    name="chevron-left"
                    color={enabledColor}
                />
                <Button title="Current Exercise" onPress={handleNavigateBack} />
            </View>
            <Text style={{ ...baseStyles.header, color: enabledColor }}>
                {exercise.movement.name}
            </Text>
            <Text style={{ ...baseStyles.subHeader, color: enabledColor }}>
                Description
            </Text>
            <View style={{ padding: 10 }}>
                <Text style={{ color: enabledColor }}>
                    {exercise.movement.description}
                </Text>
            </View>
            {exercise.notes && (
                <>
                    <HorzontalLine />
                    <Text
                        style={{ ...baseStyles.subHeader, color: enabledColor }}
                    >
                        Your Notes
                    </Text>
                    <Text style={{ color: enabledColor }}>
                        {exercise.notes}
                    </Text>
                </>
            )}
        </View>
    );
}
