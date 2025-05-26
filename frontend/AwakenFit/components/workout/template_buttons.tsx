import { View, Pressable, Text, useColorScheme } from "react-native";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { baseStyles, lightColors, darkColors } from "@/styles/global";


type workoutButtonsParams = {
    state: { historical: boolean, end_workout: boolean, add_exercise: boolean, add_set: boolean, edit_movements: boolean }
    addExercisePressed: () => void,
    editMovementsPressed: () => void,
    saveTemplatePressed: () => void,
}

export default function TemplateButtons({ state, addExercisePressed, editMovementsPressed, saveTemplatePressed }: workoutButtonsParams) {
    const colorScheme = useColorScheme();
    const enabledColor = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;

    return (
        <View style={baseStyles.spacedRow}>

            <Pressable style={baseStyles.button} onPress={editMovementsPressed} disabled={!state.add_exercise}>
                <FontAwesome size={28} name="pencil" color={enabledColor} />
                <Text style={{ color: enabledColor }}>Edit Workout</Text>
            </Pressable>
            <Pressable style={baseStyles.button} onPress={addExercisePressed} disabled={!state.add_exercise}>
                <FontAwesome size={28} name="plus-circle" color={enabledColor} />
                <Text style={{ color: enabledColor }}>Add Exercise</Text>
            </Pressable>
            <Pressable style={baseStyles.button} onPress={saveTemplatePressed} disabled={!state.add_exercise}>
                <FontAwesome size={28} name="save" color={enabledColor} />
                <Text style={{ color: enabledColor }}>Save Template</Text>
            </Pressable>
        </View>
    );
}
