import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Button, useColorScheme } from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { ExerciseProps, MomvementNode, SetNode } from "@/graphql/properties";
import { ScreenOptions } from '@/graphql/WorkoutStateReducer';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import HorzontalLine from '../general/horizonal_line';
import CustomButton from '../general/button';

type entryParams = {
    item: SetNode,
    movement: MomvementNode,
    currentSet: boolean,
    saveSet: (sequenceNumber: number, reps?: number, weight?: number, duration?: string, equipment_identifier?: string) => void
    setSelectedSet: (id: number) => void,
};

type exerciseParams = {
    exercise: ExerciseProps,
    navigateBack: (name: string, template_id?: string) => void,
    recordSet: (exercise_id: string, sequence_number: number, reps?: number, weight?: number, duration?: string, equipment_identifier?: string) => void

};

type repInputParams = {
    reps: string,
    setReps: (number: string) => void
};

type identifierInputParams = {
    equipmentIdentifier: string,
    reps: string,
    setEquipmentIdentifier: (id: string) => void,
    setReps: (number: string) => void
};

type weightInputParams = {
    weight: string,
    reps: string,
    setWeight: (number: string) => void,
    setReps: (number: string) => void,
}

type setInputParams = {
    equipment_type: string,
    movement_type: string,
    duration: string,
    weight: string,
    reps: string,
    equipmentIdentifier: string,
    setDuration: (duration: string) => void,
    setWeight: (number: string) => void,
    setReps: (number: string) => void,
    setEquipmentIdentifier: (id: string) => void,
}

function DurationInput() {
    return (
        <View>
            <Text>Need to implement</Text>
        </View>
    );
}

function RepsOnlyInput({ reps, setReps }: repInputParams) {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;

    return (
        <View style={baseStyles.spacedRow}>
            <View style={baseStyles.setTextInput}>
                <Text style={{ color: color }}>Reps</Text>
                <TextInput
                    onChangeText={newText => setReps(newText)}
                    value={reps}
                    inputMode='numeric'
                    style={baseStyles.selectHeader}
                    onFocus={() => setReps('')}
                />
            </View>
        </View>
    );
}

function IdentifierInput({ equipmentIdentifier, reps, setEquipmentIdentifier, setReps }: identifierInputParams) {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;
    return (
        <View style={baseStyles.spacedRow}>
            <View style={baseStyles.setTextInput}>
                <Text style={{ color: color }}>Identifier</Text>
                <TextInput
                    onChangeText={newText => setEquipmentIdentifier(newText)}
                    value={equipmentIdentifier}
                    inputMode='text'
                    style={baseStyles.selectHeader}
                /*onFocus={() => setEquipmentIdentifier('')}*/
                />
            </View>
            <View style={baseStyles.setTextInput}>
                <Text style={{ color: color }}>Reps</Text>
                <TextInput
                    onChangeText={newText => setReps(newText)}
                    value={reps}
                    inputMode='numeric'
                    style={baseStyles.selectHeader}
                /*onFocus={() => setReps('')}*/
                />
            </View>
        </View>
    );
}

function WeightInput({ weight, reps, setWeight, setReps }: weightInputParams) {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;
    return (
        <View style={baseStyles.spacedRow}>
            <View style={baseStyles.setTextInput}>
                <Text style={{ color: color }}>Weight</Text>
                <TextInput
                    onChangeText={newText => setWeight(newText)}
                    value={weight}
                    inputMode='numeric'
                    style={baseStyles.selectHeader}
                    onFocus={() => setWeight('')}
                />
            </View>
            <View style={baseStyles.setTextInput}>
                <Text style={{ color: color }}>Reps</Text>
                <TextInput
                    onChangeText={newText => setReps(newText)}
                    value={reps}
                    inputMode='numeric'
                    style={baseStyles.selectHeader}
                    onFocus={() => setReps('')}
                />
            </View>
        </View>
    );
}

function SetInput({ equipment_type, movement_type, reps, weight, duration, equipmentIdentifier, setReps, setWeight, setDuration, setEquipmentIdentifier }: setInputParams) {
    if (equipment_type == "none" || equipment_type == "body only" || equipment_type == "exercise ball") {
        if (movement_type == "cardio") {
            // duration input
            return <DurationInput />;
        } else {
            return <RepsOnlyInput reps={reps} setReps={setReps} />;
        }
    }
    else if (equipment_type == "resistence bands" || equipment_type == "resistance bands") {
        console.log(`current identifier: ${equipmentIdentifier}`);
        // identifier and reps
        return (
            <IdentifierInput
                equipmentIdentifier={equipmentIdentifier}
                setEquipmentIdentifier={setEquipmentIdentifier}
                reps={reps}
                setReps={setReps}
            />
        );
    }
    else {
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

const SetEntry = ({ item, movement, currentSet, saveSet, setSelectedSet }: entryParams) => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;

    const [reps, setReps] = useState(item.completedReps?.toString() || "");
    const [weight, setWeight] = useState(item.weight?.toString() || "");
    const [duration, setDuration] = useState(item.duration?.toString() || "");
    const [equipmentIdentifier, setEquipmentIdentifier] = useState(item.equipment_identifier?.toString() || "");
    const [inputForSet, setInputForSet] = useState(<View></View>);

    function handleOnSaveSet() {
        saveSet(item.sequenceNumber, Number(reps), Number(weight), duration, equipmentIdentifier);
    }

    function handleOnSelect() {
        setSelectedSet(item.sequenceNumber);
    }

    return (
        <Pressable onPress={handleOnSelect}>
            <View style={baseStyles.spacedRow}>
                <Text style={{ ...baseStyles.subHeader, color: color }}>Set {item.sequenceNumber} </Text>
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
            {
                currentSet &&
                <View style={baseStyles.container}>
                    <CustomButton
                        text="Save Set"
                        onPress={handleOnSaveSet}
                        disabled={false}
                    />
                </View>
            }
        </Pressable>
    );
}

export default function CurrentExercise({ exercise, navigateBack, recordSet }: exerciseParams) {
    const [currentSet, setCurrentSet] = useState(1);
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;

    function saveSet(sequenceNumber: number, reps?: number, weight?: number, duration?: string, equipment_identifier?: string) {
        setCurrentSet(currentSet + 1);
        recordSet(exercise.id, sequenceNumber, reps, weight, duration, equipment_identifier);
    }

    function setSelectedSet(sequence_number: number) {
        setCurrentSet(sequence_number);
    }

    function handleNavigateBack() {
        navigateBack(ScreenOptions.MOVEMENT_LIST);
    }

    return (
        <View>
            <View style={baseStyles.leftJustifiedRow}>
                <FontAwesome size={28} name="chevron-left" />
                <Button title="Execise List" onPress={handleNavigateBack} />
            </View>
            <Text style={{ ...baseStyles.mediumHeader, color: color }}>{exercise.movement.name}</Text>
            <FlatList
                data={exercise.sets}
                renderItem={({ item }) => <SetEntry item={item} movement={exercise.movement} currentSet={currentSet === item.sequenceNumber} saveSet={saveSet} setSelectedSet={setSelectedSet} />}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={HorzontalLine}
            />
        </View>
    );
}
