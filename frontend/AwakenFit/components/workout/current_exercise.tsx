import { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    Button,
    Platform,
    useColorScheme,
    KeyboardAvoidingView,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { SetNode } from "@/graphql/types";
import { ExerciseProps, MovementNode } from "@/graphql/properties";
import { ScreenOptions } from "@/graphql/WorkoutStateReducer";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import HorzontalLine from "../general/horizonal_line";
import CustomButton from "../general/button";

import DurationInput from "./duration_input";

type entryParams = {
    item: SetNode;
    movement: MovementNode;
    currentSet: boolean;
    saveSet: (
        sequenceNumber: number,
        reps?: number,
        weight?: number,
        duration?: string,
        equipment_identifier?: string
    ) => void;
    setSelectedSet: (id: number) => void;
};

type exerciseParams = {
    exercise: ExerciseProps;
    navigateBack: (name: string, template_id?: string) => void;
    recordSet: (
        exercise_id: string,
        sequence_number: number,
        reps?: number,
        weight?: number,
        duration?: string,
        equipment_identifier?: string
    ) => void;
};

type repInputParams = {
    reps: string;
    setReps: (number: string) => void;
};

type identifierInputParams = {
    equipmentIdentifier: string;
    reps: string;
    setEquipmentIdentifier: (id: string) => void;
    setReps: (number: string) => void;
};

type weightInputParams = {
    weight: string;
    reps: string;
    setWeight: (number: string) => void;
    setReps: (number: string) => void;
};

type setInputParams = {
    equipment_type: string;
    movement_type: string;
    duration: string;
    weight: string;
    reps: string;
    equipmentIdentifier: string;
    setDuration: (duration: string) => void;
    setWeight: (number: string) => void;
    setReps: (number: string) => void;
    setEquipmentIdentifier: (id: string) => void;
};

function RepsOnlyInput({ reps, setReps }: repInputParams) {
    const colorScheme = useColorScheme();
    const color =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;
    const inputRef = useRef<TextInput>(null);

    return (
        <View style={baseStyles.spacedRow}>
            <Pressable
                style={baseStyles.setTextInput}
                onPress={() => inputRef.current?.focus()}
            >
                <Text style={{ color: color }}>Reps</Text>
                <TextInput
                    ref={inputRef}
                    onChangeText={(newText) => setReps(newText)}
                    value={reps}
                    inputMode="numeric"
                    style={baseStyles.selectHeader}
                    onFocus={() => setReps("")}
                />
            </Pressable>
        </View>
    );
}

function IdentifierInput({
    equipmentIdentifier,
    reps,
    setEquipmentIdentifier,
    setReps,
}: identifierInputParams) {
    const colorScheme = useColorScheme();
    const color =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;
    const identifierRef = useRef<TextInput>(null);
    const repsRef = useRef<TextInput>(null);
    return (
        <View style={baseStyles.spacedRow}>
            <Pressable
                style={baseStyles.setTextInput}
                onPress={() => identifierRef.current?.focus()}
            >
                <Text style={{ color: color }}>Identifier</Text>
                <TextInput
                    ref={identifierRef}
                    onChangeText={(newText) => setEquipmentIdentifier(newText)}
                    value={equipmentIdentifier}
                    inputMode="text"
                    style={baseStyles.selectHeader}
                    onFocus={() => setEquipmentIdentifier("")}
                />
            </Pressable>
            <Pressable
                style={baseStyles.setTextInput}
                onPress={() => repsRef.current?.focus()}
            >
                <Text style={{ color: color }}>Reps</Text>
                <TextInput
                    ref={repsRef}
                    onChangeText={(newText) => setReps(newText)}
                    value={reps}
                    inputMode="numeric"
                    style={baseStyles.selectHeader}
                    onFocus={() => setReps("")}
                />
            </Pressable>
        </View>
    );
}

function WeightInput({ weight, reps, setWeight, setReps }: weightInputParams) {
    const colorScheme = useColorScheme();
    const color =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;
    const weightRef = useRef<TextInput>(null);
    const repsRef = useRef<TextInput>(null);

    return (
        <View style={baseStyles.spacedRow}>
            <Pressable
                style={baseStyles.setTextInput}
                onPress={() => weightRef.current?.focus()}
            >
                <Text style={{ color: color }}>Weight</Text>
                <TextInput
                    ref={weightRef}
                    onChangeText={(newText) => setWeight(newText)}
                    value={weight}
                    inputMode="decimal"
                    style={baseStyles.selectHeader}
                    onFocus={() => setWeight("")}
                />
            </Pressable>
            <Pressable
                style={baseStyles.setTextInput}
                onPress={() => repsRef.current?.focus()}
            >
                <Text style={{ color: color }}>Reps</Text>
                <TextInput
                    ref={repsRef}
                    onChangeText={(newText) => setReps(newText)}
                    value={reps}
                    inputMode="numeric"
                    style={baseStyles.selectHeader}
                    onFocus={() => setReps("")}
                />
            </Pressable>
        </View>
    );
}

function SetInput({
    equipment_type,
    movement_type,
    reps,
    weight,
    duration,
    equipmentIdentifier,
    setReps,
    setWeight,
    setDuration,
    setEquipmentIdentifier,
}: setInputParams) {
    if (movement_type == "cardio") {
        // duration input
        return <DurationInput duration={duration} setDuration={setDuration} />;
    } else if (
        equipment_type == "none" ||
        equipment_type == "body only" ||
        equipment_type == "exercise ball"
    ) {
        return <RepsOnlyInput reps={reps} setReps={setReps} />;
    } else if (
        equipment_type == "resistence bands" ||
        equipment_type == "resistance bands"
    ) {
        // identifier and reps
        return (
            <IdentifierInput
                equipmentIdentifier={equipmentIdentifier}
                setEquipmentIdentifier={setEquipmentIdentifier}
                reps={reps}
                setReps={setReps}
            />
        );
    } else {
        // weight and reps
        return (
            <WeightInput
                weight={weight}
                setWeight={setWeight}
                reps={reps}
                setReps={setReps}
            />
        );
    }
}

const SetEntry = ({
    item,
    movement,
    currentSet,
    saveSet,
    setSelectedSet,
}: entryParams) => {
    const colorScheme = useColorScheme();
    const color =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;

    const [reps, setReps] = useState(item.completedReps?.toString() || "");
    const [weight, setWeight] = useState(item.weight?.toString() || "");
    const [duration, setDuration] = useState(item.duration?.toString() || "");
    const [equipmentIdentifier, setEquipmentIdentifier] = useState(
        item.equipmentIdentifier?.toString() || ""
    );
    const [validSet, setValidSet] = useState(false);
    const [saveCalled, setSaveCalled] = useState(false);

    function validateSetInput() {
        var equipment_type = movement.equipmentType.toLowerCase();
        var movement_type = movement.movementType.toLowerCase();
        if (movement_type == "cardio") {
            return duration.length > 0;
        } else if (
            equipment_type == "none" ||
            equipment_type == "body only" ||
            equipment_type == "exercise ball"
        ) {
            return Number(reps) > 0;
        } else if (
            equipment_type == "resistence bands" ||
            equipment_type == "resistance bands"
        ) {
            // identifier and reps
            return equipmentIdentifier.length > 0 && Number(reps) > 0;
        } else {
            // weight and reps
            return Number(weight) > 0 && Number(reps) > 0;
        }
    }

    // this is another check to make sure that when the movement Id changes, that we
    // refresh the component visuals for each set entry
    useEffect(() => {
        setReps(item.completedReps?.toString() || "");
        setWeight(item.weight?.toString() || "");
        setDuration(item.duration?.toString() || "");
        setEquipmentIdentifier(item.equipmentIdentifier?.toString() || "");
    }, [movement.id]);

    function handleOnSaveSet() {
        setSaveCalled(true);
        var setIsValid = validateSetInput();
        setValidSet(setIsValid);
        if (setIsValid) {
            saveSet(
                item.sequenceNumber,
                Number(reps),
                Number(weight),
                duration,
                equipmentIdentifier
            );
        }
    }

    function handleOnSelect() {
        setSelectedSet(item.sequenceNumber);
    }

    return (
        <Pressable onPress={handleOnSelect}>
            <View style={baseStyles.spacedRow}>
                <View>
                    <Text style={{ ...baseStyles.subHeader, color: color }}>
                        Set {item.sequenceNumber}
                    </Text>
                    {item.minReps && (
                        <Text style={{ color: color }}>
                            Min Reps: {item.minReps}
                        </Text>
                    )}
                    {item.maxReps && (
                        <Text style={{ color: color }}>
                            Max Reps: {item.maxReps}
                        </Text>
                    )}
                </View>
                <SetInput
                    equipment_type={movement.equipmentType.toLowerCase()}
                    movement_type={movement.movementType.toLocaleLowerCase()}
                    reps={reps}
                    weight={weight}
                    duration={duration}
                    equipmentIdentifier={equipmentIdentifier}
                    setReps={setReps}
                    setWeight={setWeight}
                    setDuration={setDuration}
                    setEquipmentIdentifier={setEquipmentIdentifier}
                />
            </View>
            {!validSet && currentSet && saveCalled && (
                <View>
                    <Text>Populate all fields</Text>
                </View>
            )}
            {currentSet && (
                <View style={baseStyles.container}>
                    <CustomButton
                        text="Save Set"
                        onPress={handleOnSaveSet}
                        disabled={false}
                    />
                </View>
            )}
        </Pressable>
    );
};

export default function CurrentExercise({
    exercise,
    navigateBack,
    recordSet,
}: exerciseParams) {
    const [currentSet, setCurrentSet] = useState(1);
    const colorScheme = useColorScheme();
    const color =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;

    function saveSet(
        sequenceNumber: number,
        reps?: number,
        weight?: number,
        duration?: string,
        equipment_identifier?: string
    ) {
        setCurrentSet(currentSet + 1);
        recordSet(
            exercise.id,
            sequenceNumber,
            reps,
            weight,
            duration,
            equipment_identifier
        );
    }

    useEffect(() => {
        // add logic here to set the current Set based on what data is populate
        // for this exercise
        setCurrentSet(1);
    }, [exercise.movement.id]);

    function setSelectedSet(sequence_number: number) {
        setCurrentSet(sequence_number);
    }

    function handleNavigateBack() {
        navigateBack(ScreenOptions.MOVEMENT_LIST);
    }

    return (
        <View style={{ height: "95%" }}>
            <View style={{ ...baseStyles.leftJustifiedRow, height: "auto" }}>
                <FontAwesome size={28} name="chevron-left" color={color} />
                <Button title="Execise List" onPress={handleNavigateBack} />
            </View>
            <Text style={{ ...baseStyles.mediumHeader, color: color }}>
                {exercise.movement.name}
            </Text>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={50}
            >
                <FlatList
                    data={exercise.sets}
                    renderItem={({ item }) => (
                        <SetEntry
                            item={item}
                            movement={exercise.movement}
                            currentSet={currentSet === item.sequenceNumber}
                            saveSet={saveSet}
                            setSelectedSet={setSelectedSet}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={HorzontalLine}
                    style={{ height: "80%" }}
                />
            </KeyboardAvoidingView>
        </View>
    );
}
