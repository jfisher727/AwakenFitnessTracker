import { useState } from "react";
import { View, Button } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import CustomButton from "../general/button";
import TextInputField from "../general/text_input";

import { baseStyles } from "@/styles/global";

import NavigateBack from "../general/navigate_back";

type addSetParams = {
    navigateBack: () => void;
    addSets: (count: number) => void;
};

export default function AddSets({ navigateBack, addSets }: addSetParams) {
    const [count, setCount] = useState("1");

    function handleNavigateBack() {
        navigateBack();
    }

    function handleAddSets() {
        addSets(parseInt(count));
    }

    return (
        <View>
            <NavigateBack
                onPress={handleNavigateBack}
                label="Current Exercise"
            />
            <View style={baseStyles.modal}>
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
