import { useState, useEffect } from "react";
import {
    Text,
    TextInput,
    View,
    Pressable,
    FlatList,
    useColorScheme,
} from "react-native";

import {
    useGetMovementsLazyQuery,
    GetMovementsQueryVariables,
    MovementNodeEdge,
    MovementNode,
} from "@/graphql/types";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import DropdownSelect from "@/components/general/dropdown_select";
import Spinner from "../general/spinner";
import HorzontalLine from "../general/horizonal_line";
import { equipmentOptions, muscleGroupOptions } from "@/util/workout";

const DEBOUNCE_DELAY: number = 500; // milliseconds

interface ExerciseSearchProps {
    addExercise: (movement: MovementNode) => void;
}

export default function ExerciseSearch({ addExercise }: ExerciseSearchProps) {
    const colorScheme = useColorScheme();

    const [execute, { loading, error, data }] = useGetMovementsLazyQuery();

    const [name, setName] = useState("Search");
    const [debouncedName, setDebouncedName] = useState("");
    const [selectedEquipment, setSelectedEquipment] = useState({
        key: "",
        value: "",
    });
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState({
        key: "",
        value: "",
    });

    const RowEntry = ({ node }: MovementNodeEdge) => {
        return (
            <Pressable
                style={baseStyles.selectableRow}
                onPress={() => addExercise(node)}
            >
                <Text style={{ color: lightColors.primaryColor, fontSize: 20 }}>
                    {node.name}
                </Text>
            </Pressable>
        );
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (name.length == 0) {
                setName("Search");
            }
            setDebouncedName(name);
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timeoutId);
    }, [name]);

    useEffect(() => {
        const variables: GetMovementsQueryVariables = { count: 20 };
        if (debouncedName.length >= 3 && debouncedName != "Search") {
            variables.name = debouncedName;
        }
        if (selectedEquipment.value.length > 0) {
            variables.equipment = selectedEquipment.value;
        }
        if (selectedMuscleGroup.value.length > 0) {
            variables.muscle = selectedMuscleGroup.value;
        }
        execute({
            variables: variables,
        });
    }, [selectedEquipment, selectedMuscleGroup, debouncedName]);

    useEffect(() => {
        execute({ variables: { count: 20 } });
    }, []);

    if (error) {
        console.log(error);
        return <Text>Error...</Text>;
    }

    return (
        <>
            <Text
                style={{
                    ...baseStyles.subHeader,
                    color:
                        colorScheme === "light"
                            ? lightColors.primaryColor
                            : darkColors.primaryColor,
                }}
            >
                Search for Exercises
            </Text>
            <View
                style={{
                    ...baseStyles.modal,
                }}
            >
                <View
                    style={{
                        ...baseStyles.modal,
                        borderWidth: 1,
                        borderColor: darkColors.background,
                        margin: 2,
                    }}
                >
                    <TextInput
                        inputMode="text"
                        defaultValue={name}
                        onChangeText={(newText) => setName(newText)}
                        style={{
                            ...baseStyles.selectHeader,
                            color:
                                colorScheme === "light"
                                    ? lightColors.primaryColor
                                    : darkColors.primaryColor,
                        }}
                    />
                </View>
                <DropdownSelect
                    placeHolder="Equipment"
                    selectedValue={selectedEquipment}
                    options={equipmentOptions}
                    onSelect={setSelectedEquipment}
                    showSearch={false}
                />
                <DropdownSelect
                    placeHolder="Muscle Group"
                    selectedValue={selectedMuscleGroup}
                    options={muscleGroupOptions}
                    onSelect={setSelectedMuscleGroup}
                    showSearch={false}
                />
                {data && (
                    <View style={baseStyles.flatListContainer}>
                        <FlatList
                            data={data?.movements?.edges}
                            renderItem={({ item }) => (
                                <RowEntry
                                    cursor={item?.cursor || ""}
                                    node={item?.node}
                                />
                            )}
                            keyExtractor={(item) => item?.cursor || ""}
                            refreshing={loading}
                            ItemSeparatorComponent={HorzontalLine}
                        />
                    </View>
                )}
                {loading && <Spinner />}
            </View>
        </>
    );
}
