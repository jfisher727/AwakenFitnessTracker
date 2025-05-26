import { View, Pressable, Text, useColorScheme } from "react-native";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { baseStyles, lightColors, darkColors } from "@/styles/global";
import { hexToRGBA } from "@/util/color";


type workoutButtonsParams = {
    state: { historical: boolean, end_workout: boolean, add_exercise: boolean, add_set: boolean, edit_movements: boolean }
    stopWorkoutPressed: () => void,
    addExercisePressed: () => void,
    editMovementsPressed: () => void,
    addSetPressed: () => void,
    historicalPressed: () => void,
}

export default function WorkoutButtons({ state, stopWorkoutPressed, addExercisePressed, editMovementsPressed, addSetPressed, historicalPressed }: workoutButtonsParams) {
    const colorScheme = useColorScheme();
    const enabledColor = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;
    const disabledColor = hexToRGBA(enabledColor, 0.6);

    return (
        <View style={baseStyles.spacedRow}>
            {
                state.edit_movements ?
                    <Pressable style={baseStyles.button} onPress={editMovementsPressed} disabled={!state.add_exercise}>
                        <FontAwesome size={28} name="pencil" color={enabledColor} />
                        <Text style={{ color: enabledColor }}>Edit Workout</Text>
                    </Pressable> :
                    <Pressable style={baseStyles.button} onPress={historicalPressed} disabled={!state.historical}>
                        <FontAwesome size={28} name="line-chart" color={state.historical ? enabledColor : disabledColor} />
                        <Text style={{ color: state.end_workout ? enabledColor : disabledColor }}>Historical</Text>
                    </Pressable>
            }
            {
                state.add_exercise ?
                    <Pressable style={baseStyles.button} onPress={addExercisePressed} disabled={!state.add_exercise}>
                        <FontAwesome size={28} name="plus-circle" color={enabledColor} />
                        <Text style={{ color: enabledColor }}>Add Exercise</Text>
                    </Pressable> :
                    <Pressable style={baseStyles.button} onPress={addSetPressed} disabled={!state.add_set}>
                        <FontAwesome size={28} name="plus-circle" color={enabledColor} />
                        <Text style={{ color: enabledColor }}>Add Sets</Text>
                    </Pressable>
            }
            <Pressable style={baseStyles.button} onPress={stopWorkoutPressed} disabled={!state.end_workout}>
                <FontAwesome size={28} name="stop-circle" color={state.end_workout ? enabledColor : disabledColor} />
                <Text style={{ color: state.end_workout ? enabledColor : disabledColor }}>End Workout</Text>
            </Pressable>
        </View>
    );
}
