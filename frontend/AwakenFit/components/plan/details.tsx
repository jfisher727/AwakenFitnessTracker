import { useState, useEffect, useReducer } from "react";
import { View, Text, useColorScheme } from "react-native";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import { workoutPlanTypeOptions } from "@/util/workout";

import CustomButton from "@/components/general/button";
import TextInputField from "@/components/general/text_input";
import DropdownSelect from "@/components/general/dropdown_select";

type params = {
    name: string;
    type: string;
    setDetails: (name: string, type: string) => void;
};

export default function PlanDetails({ name, type, setDetails }: params) {
    const colorScheme = useColorScheme();

    var option = workoutPlanTypeOptions.find((entry) => entry.key === type) || {
        key: "",
        value: "",
    };

    const [planName, setPlanName] = useState(name);
    const [planType, setPlanType] = useState(option);
    const [showDescriptions, setShowDescriptions] = useState(false);

    const textColor =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;

    function toggleDescriptions() {
        setShowDescriptions(!showDescriptions);
    }

    function handleSetDetails() {
        setDetails(planName, planType.key);
    }

    return (
        <>
            <TextInputField
                inputMode="text"
                onChangeText={setPlanName}
                defaultValue={planName}
                secureTextEntry={false}
                header="Workout Plan Name"
                showHeader={true}
            />
            <CustomButton
                text="Plan Type Descriptions"
                onPress={toggleDescriptions}
                disabled={false}
            />
            {showDescriptions && (
                <View>
                    <Text
                        style={{
                            ...baseStyles.text,
                            color: textColor,
                        }}
                    >
                        Ongoing plans will start back on day 1 after all
                        previously planned days have been completed.
                    </Text>
                    <Text
                        style={{
                            ...baseStyles.text,
                            color: textColor,
                        }}
                    >
                        Definite plans will conclude after all planned days have
                        been completed.
                    </Text>
                </View>
            )}
            <DropdownSelect
                placeHolder="Plan Type"
                selectedValue={planType}
                options={workoutPlanTypeOptions}
                onSelect={setPlanType}
                showSearch={false}
            />
            <CustomButton
                text="Save Details"
                onPress={handleSetDetails}
                disabled={false}
            />
        </>
    );
}
