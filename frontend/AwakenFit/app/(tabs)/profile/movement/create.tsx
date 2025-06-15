import { useState, useEffect } from "react";
import { ScrollView, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

import { baseStyles, lightColors, darkColors } from "@/styles/global";
import TextInputField from "@/components/general/text_input";
import CustomButton from "@/components/general/button";
import DropdownSelect from "@/components/general/dropdown_select";
import Spinner from "@/components/general/spinner";

import {
    equipmentOptions,
    muscleGroupOptions,
    movementTypeOptions,
} from "@/util/workout";

import { useMovementCreateMutation } from "@/graphql/types";

export default function Create() {
    const colorScheme = useColorScheme();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState({
        key: "",
        value: "",
    });
    const [secondaryMuscleGroup, setSecondaryMuscleGroup] = useState({
        key: "",
        value: "",
    });
    const [equipmentType, setEquipmentType] = useState({ key: "", value: "" });
    const [movementType, setMovementType] = useState({ key: "", value: "" });

    const [execute, { data, loading, error }] = useMovementCreateMutation();

    function submit() {
        execute({
            variables: {
                name: name,
                description: description,
                primaryMuscleGroup: primaryMuscleGroup.value,
                secondaryMuscleGroup: secondaryMuscleGroup.value,
                equipmentType: equipmentType.value,
                movementType: movementType.value,
            },
        });
    }

    useEffect(() => {
        if (data) {
            console.log(data);
            if (data?.movementCreate?.errors) {
                console.log(data.movementCreate.errors);
            } else {
                console.log("resetting input");
                setName("");
                setDescription("");
                setPrimaryMuscleGroup({ key: "", value: "" });
                setSecondaryMuscleGroup({ key: "", value: "" });
                setEquipmentType({ key: "", value: "" });
                setMovementType({ key: "", value: "" });
            }
        }
    }, [data]);

    if (error) {
        console.log(error);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    ...baseStyles.container,
                    backgroundColor:
                        colorScheme === "light"
                            ? lightColors.background
                            : darkColors.background,
                }}
            >
                {loading ? (
                    <Spinner />
                ) : (
                    <ScrollView style={baseStyles.modal}>
                        <TextInputField
                            inputMode="text"
                            onChangeText={setName}
                            defaultValue={name}
                            secureTextEntry={false}
                            header="Movement Name"
                            showHeader={true}
                        />
                        <TextInputField
                            inputMode="text"
                            onChangeText={setDescription}
                            defaultValue={description}
                            secureTextEntry={false}
                            header="Description"
                            showHeader={true}
                        />
                        <DropdownSelect
                            placeHolder="Equipment"
                            selectedValue={equipmentType}
                            options={equipmentOptions}
                            onSelect={setEquipmentType}
                            showSearch={false}
                        />
                        <DropdownSelect
                            placeHolder="Movement Type"
                            selectedValue={movementType}
                            options={movementTypeOptions}
                            onSelect={setMovementType}
                            showSearch={false}
                        />
                        <DropdownSelect
                            placeHolder="Primary Muscle Group"
                            selectedValue={primaryMuscleGroup}
                            options={muscleGroupOptions}
                            onSelect={setPrimaryMuscleGroup}
                            showSearch={false}
                        />
                        <DropdownSelect
                            placeHolder="Secondary Muscle Group"
                            selectedValue={secondaryMuscleGroup}
                            options={muscleGroupOptions}
                            onSelect={setSecondaryMuscleGroup}
                            showSearch={false}
                        />
                        <CustomButton
                            text="Create"
                            onPress={submit}
                            disabled={false}
                        />
                    </ScrollView>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
