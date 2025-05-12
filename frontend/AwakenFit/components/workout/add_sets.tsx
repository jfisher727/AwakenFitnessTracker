import { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import CustomButton from "../general/button";
import TextInputField from "../general/text_input";

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
            <View style={{ padding: 10 }}>
                <TextInputField
                    inputMode="numeric"
                    onChangeText={setCount}
                    defaultValue={count}
                    secureTextEntry={false}
                    header="How many sets would you like to add?"
                    showHeader={true}
                />
                <CustomButton
                    text="Add Sets"
                    onPress={handleAddSets}
                    disabled={false}
                />
            </View>
        </View>
    );
}
