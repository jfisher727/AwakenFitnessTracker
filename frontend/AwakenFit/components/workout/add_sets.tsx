import { View, Text, Button } from "react-native";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { baseStyles } from "@/styles/global";

type addSetParams = {
    navigateBack: () => void,
}

export default function AddSets({ navigateBack }: addSetParams) {

    function handleNavigateBack() {
        navigateBack();
    }

    return (
        <View>
            <View style={baseStyles.leftJustifiedRow}>
                <FontAwesome size={28} name="chevron-left" />
                <Button title="Current Exercise" onPress={handleNavigateBack} />
            </View>
            <Text>How many sets would you like to add?</Text>
        </View>
    );
}
