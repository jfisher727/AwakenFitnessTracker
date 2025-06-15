import { useState } from "react";
import { Text, ScrollView, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

import { MovementNode, useMovementEditMutation } from "@/graphql/types";

import ExerciseSearch from "@/components/workout/exercise_search";

import { baseStyles, lightColors, darkColors } from "@/styles/global";
import CustomButton from "@/components/general/button";
import DropdownSelect from "@/components/general/dropdown_select";
import Spinner from "@/components/general/spinner";

import {
    equipmentOptions,
    muscleGroupOptions,
    movementTypeOptions,
} from "@/util/workout";

export default function Edit() {
    const colorScheme = useColorScheme();

    const initialNode: MovementNode = {
        id: "",
        name: "",
        description: "",
        equipmentType: "",
        movementType: "",
        primaryMuscleGroup: "",
        secondaryMuscleGroup: "",
    };

    const [selectedMovement, setSelectedMovement] = useState(initialNode);
    const [showSearch, setShowSearch] = useState(true);
    const [execute, { data, loading, error }] = useMovementEditMutation();

    function handleSelectExercise(node: MovementNode) {
        setSelectedMovement(node);
        setShowSearch(false);
    }

    function handleSetEquipmentType(equipment: { key: string; value: string }) {
        setSelectedMovement({
            ...selectedMovement,
            equipmentType: equipment.value,
        });
    }

    function handleSetMovementType(type: { key: string; value: string }) {
        setSelectedMovement({
            ...selectedMovement,
            movementType: type.value,
        });
    }

    function handlePrimaryMuscleGroup(muscleGroup: {
        key: string;
        value: string;
    }) {
        setSelectedMovement({
            ...selectedMovement,
            primaryMuscleGroup: muscleGroup.value,
        });
    }

    function handleSecondaryMuscleGroup(muscleGroup: {
        key: string;
        value: string;
    }) {
        setSelectedMovement({
            ...selectedMovement,
            secondaryMuscleGroup: muscleGroup.value,
        });
    }

    function handleUpdateMovement() {
        execute({
            variables: {
                id: selectedMovement.id,
                movementType: selectedMovement.movementType,
                equipmentType: selectedMovement.equipmentType,
                primaryMuscleGroup: selectedMovement.primaryMuscleGroup,
                secondaryMuscleGroup: selectedMovement.secondaryMuscleGroup,
            },
        });
    }

    if (data) {
        if (data.movementEdit?.errors) {
            console.log(data.movementEdit?.errors);
        } else {
        }
    }

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
                {showSearch ? (
                    <ExerciseSearch addExercise={handleSelectExercise} />
                ) : (
                    <ScrollView style={baseStyles.modal}>
                        {loading ? (
                            <Spinner />
                        ) : (
                            <>
                                <Text style={baseStyles.subHeader}>
                                    {selectedMovement.name}
                                </Text>
                                <DropdownSelect
                                    placeHolder="Equipment"
                                    selectedValue={{
                                        key: selectedMovement.equipmentType,
                                        value: selectedMovement.equipmentType,
                                    }}
                                    options={equipmentOptions}
                                    onSelect={handleSetEquipmentType}
                                    showSearch={false}
                                />
                                <DropdownSelect
                                    placeHolder="Movement Type"
                                    selectedValue={{
                                        key: selectedMovement.movementType,
                                        value: selectedMovement.movementType,
                                    }}
                                    options={movementTypeOptions}
                                    onSelect={handleSetMovementType}
                                    showSearch={false}
                                />
                                <DropdownSelect
                                    placeHolder="Primary Muscle Group"
                                    selectedValue={{
                                        key: selectedMovement.primaryMuscleGroup,
                                        value: selectedMovement.primaryMuscleGroup,
                                    }}
                                    options={muscleGroupOptions}
                                    onSelect={handlePrimaryMuscleGroup}
                                    showSearch={false}
                                />
                                <DropdownSelect
                                    placeHolder="Secondary Muscle Group"
                                    selectedValue={{
                                        key:
                                            selectedMovement.secondaryMuscleGroup ??
                                            "None",
                                        value:
                                            selectedMovement.secondaryMuscleGroup ??
                                            "None",
                                    }}
                                    options={muscleGroupOptions}
                                    onSelect={handleSecondaryMuscleGroup}
                                    showSearch={false}
                                />
                                <CustomButton
                                    text="Update Movement"
                                    onPress={handleUpdateMovement}
                                    disabled={false}
                                />
                            </>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
