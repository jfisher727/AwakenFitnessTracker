import { useEffect, useState } from "react";
import { View, Pressable, Text, useColorScheme } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { ScreenOptions } from "@/graphql/WorkoutStateReducer";

import { baseStyles, lightColors, darkColors } from "@/styles/global";
import { hexToRGBA } from "@/util/color";

type workoutButtonsParams = {
    screen: string;
    stopWorkoutPressed: () => void;
    addExercisePressed: () => void;
    editMovementsPressed: () => void;
    addSetPressed: () => void;
    historicalPressed: () => void;
    notesPressed: () => void;
};

export default function WorkoutButtons({
    screen,
    stopWorkoutPressed,
    addExercisePressed,
    editMovementsPressed,
    addSetPressed,
    historicalPressed,
    notesPressed,
}: workoutButtonsParams) {
    const colorScheme = useColorScheme();
    const enabledColor =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;
    const disabledColor = hexToRGBA(enabledColor, 0.6);

    switch (screen) {
        case ScreenOptions.MOVEMENT_LIST: {
            return (
                <View style={{ ...baseStyles.spacedRow }}>
                    <Pressable
                        style={baseStyles.button}
                        onPress={editMovementsPressed}
                        disabled={false}
                    >
                        <FontAwesome
                            size={28}
                            name="pencil"
                            color={enabledColor}
                        />
                        <Text style={{ color: enabledColor }}>
                            Edit Workout
                        </Text>
                    </Pressable>
                    <Pressable
                        style={baseStyles.button}
                        onPress={addExercisePressed}
                        disabled={false}
                    >
                        <FontAwesome
                            size={28}
                            name="plus-circle"
                            color={enabledColor}
                        />
                        <Text style={{ color: enabledColor }}>
                            Add Exercise
                        </Text>
                    </Pressable>
                    <Pressable
                        style={baseStyles.button}
                        onPress={stopWorkoutPressed}
                        disabled={false}
                    >
                        <FontAwesome
                            size={28}
                            name="stop-circle"
                            color={enabledColor}
                        />
                        <Text
                            style={{
                                color: enabledColor,
                            }}
                        >
                            End Workout
                        </Text>
                    </Pressable>
                </View>
            );
        }
        case ScreenOptions.ADD_EXERCISE: {
            return <View style={{ ...baseStyles.spacedRow }}></View>;
        }
        case ScreenOptions.ADD_SETS: {
            return <View style={{ ...baseStyles.spacedRow }}></View>;
        }
        case ScreenOptions.CURRENT_EXERCISE: {
            return (
                <View style={{ ...baseStyles.spacedRow }}>
                    <Pressable
                        style={baseStyles.button}
                        onPress={historicalPressed}
                        disabled={false}
                    >
                        <FontAwesome
                            size={28}
                            name="line-chart"
                            color={enabledColor}
                        />
                        <Text
                            style={{
                                color: enabledColor,
                            }}
                        >
                            Historical
                        </Text>
                    </Pressable>
                    <Pressable
                        style={baseStyles.button}
                        onPress={addSetPressed}
                        disabled={false}
                    >
                        <FontAwesome
                            size={28}
                            name="plus-circle"
                            color={enabledColor}
                        />
                        <Text style={{ color: enabledColor }}>Add Sets</Text>
                    </Pressable>
                    <Pressable
                        style={baseStyles.button}
                        onPress={notesPressed}
                        disabled={false}
                    >
                        <FontAwesome
                            size={28}
                            name="sticky-note"
                            color={enabledColor}
                        />
                        <Text style={{ color: enabledColor }}>Notes</Text>
                    </Pressable>
                </View>
            );
        }
        case ScreenOptions.HISTORICAL: {
            return <View style={{ ...baseStyles.spacedRow }}></View>;
        }
        case ScreenOptions.WORKOUT_REVIEW: {
            return <View style={{ ...baseStyles.spacedRow }}></View>;
        }
        default: {
            return <View style={{ ...baseStyles.spacedRow }}></View>;
        }
    }
}
