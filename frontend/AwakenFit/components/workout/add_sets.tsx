import { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import CustomButton from "../general/button";

import { baseStyles } from "@/styles/global";

type addSetParams = {
    navigateBack: () => void,
    addSets: (count: number) => void,
}

export default function AddSets({ navigateBack, addSets }: addSetParams) {
    const [count, setCount] = useState('1');

    function handleNavigateBack() {
        navigateBack();
    }

    function handleAddSets() {
        addSets(Number(count));
    }

    return (
        <View>
            <View style={baseStyles.leftJustifiedRow}>
                <FontAwesome size={28} name="chevron-left" />
                <Button title="Current Exercise" onPress={handleNavigateBack} />
            </View>
            <Text>How many sets would you like to add?</Text>
            <TextInput
                onChangeText={newText => setCount(newText)}
                value={count}
                inputMode="numeric"
                onFocus={() => setCount('')}
            />
            <CustomButton
                text="Add Sets"
                onPress={handleAddSets}
                disabled={false}
            />
        </View>
    );
}
