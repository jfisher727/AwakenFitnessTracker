import { useState } from "react";
import {
    View,
    Text,
    Button,
    TextInput,
    FlatList,
    useColorScheme,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import CustomButton from "../general/button";

import { MovementNode, SetNode } from "@/graphql/properties";

import { baseStyles, lightColors, darkColors } from "@/styles/global";
import HorzontalLine from "../general/horizonal_line";
import NavigateBack from "../general/navigate_back";

type addSetParams = {
    movement: MovementNode;
    navigateBack: () => void;
    addSets: (setDetails: SetNode[]) => void;
};

type templateSetEntryParams = {
    movement: MovementNode;
    set: SetNode;
    setMinReps: (id: string, count: string) => void;
    setMaxReps: (id: string, count: string) => void;
};

function TemplateSetEntry({
    movement,
    set,
    setMinReps,
    setMaxReps,
}: templateSetEntryParams) {
    const colorScheme = useColorScheme();
    const color =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;

    if (movement.movementType === "cardio") {
        return (
            <View>
                <Text>Set {set.sequenceNumber}</Text>
                <Text>Duration:</Text>
            </View>
        );
    }
    return (
        <View style={baseStyles.spacedRow}>
            <View>
                <Text>Set {set.sequenceNumber}</Text>
            </View>
            <View style={baseStyles.setTextInput}>
                <Text style={{ color: color }}>Min Reps</Text>
                <TextInput
                    onChangeText={(newText) => setMinReps(set.id, newText)}
                    value={String(set.minReps)}
                    inputMode="numeric"
                    style={baseStyles.selectHeader}
                    onFocus={() => setMinReps(set.id, "")}
                />
            </View>
            <View style={baseStyles.setTextInput}>
                <Text style={{ color: color }}>Max Reps</Text>
                <TextInput
                    onChangeText={(newText) => setMaxReps(set.id, newText)}
                    value={String(set.maxReps)}
                    inputMode="numeric"
                    style={baseStyles.selectHeader}
                    onFocus={() => setMaxReps(set.id, "")}
                />
            </View>
        </View>
    );
}

export default function AddTemplateSets({
    movement,
    navigateBack,
    addSets,
}: addSetParams) {
    const initialSet: SetNode = {
        id: movement.name + 1,
        sequenceNumber: 1,
        minReps: 1,
        maxReps: 1,
        duration: "",
        setType: "standard",
        parentSet: "",
    };
    const [templateSets, setTemplateSets] = useState([initialSet]);

    function handleNavigateBack() {
        navigateBack();
    }

    function handleAddSet() {
        const newId: number = templateSets.length + 1;
        var addedSet: SetNode = {
            id: movement.name + newId,
            sequenceNumber: newId,
            minReps: 1,
            maxReps: 1,
            duration: "",
            setType: "standard",
            parentSet: "",
        };
        setTemplateSets([...templateSets, addedSet]);
    }

    function updateMinReps(id: string, count: string) {
        const updatedSets = templateSets.map((set) => {
            if (set.id === id) {
                const updatedSet = { ...set };
                updatedSet.minReps = Number(count);

                return updatedSet;
            }
            return set;
        });
        setTemplateSets(updatedSets);
    }

    function updateMaxreps(id: string, count: string) {
        const updatedSets = templateSets.map((set) => {
            if (set.id === id) {
                const updatedSet = { ...set };
                updatedSet.maxReps = Number(count);

                return updatedSet;
            }
            return set;
        });
        setTemplateSets(updatedSets);
    }

    function handleSaveExercise() {
        addSets(templateSets);
    }

    return (
        <View>
            <NavigateBack onPress={handleNavigateBack} label="Exercise List" />
            <View>
                <Text>{movement.name}</Text>
            </View>
            <HorzontalLine />
            <FlatList
                data={templateSets}
                renderItem={({ item }) => (
                    <TemplateSetEntry
                        movement={movement}
                        set={item}
                        setMinReps={updateMinReps}
                        setMaxReps={updateMaxreps}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
            <CustomButton
                text="Add Set"
                onPress={handleAddSet}
                disabled={false}
            />
            <HorzontalLine />
            <CustomButton
                text="Save Exercise"
                onPress={handleSaveExercise}
                disabled={false}
            />
        </View>
    );
}
