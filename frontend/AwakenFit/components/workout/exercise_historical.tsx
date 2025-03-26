import { View, Text, Button } from "react-native";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { baseStyles } from "@/styles/global";

import { ScreenOptions } from "@/graphql/WorkoutStateReducer";

type historicalParams = {
    movementId: string,
    navigateBack: (name: string, template_id?: string) => void,
}

export default function ExerciseHistorical({ movementId, navigateBack }: historicalParams) {

    function handleNavigateBack() {
        navigateBack(ScreenOptions.CURRENT_EXERCISE);
    }

    return (
        <View>
            <View style={baseStyles.leftJustifiedRow}>
                <FontAwesome size={28} name="chevron-left" /> :
                <Button title="Current Exercise" onPress={handleNavigateBack} />
            </View>
            <Text>Exercise Historical View</Text>
        </View>
    );
}
