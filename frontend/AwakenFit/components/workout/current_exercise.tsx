import { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Button, useColorScheme } from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { ExerciseProps, SetNode } from "@/graphql/properties";
import { ScreenOptions } from '@/graphql/WorkoutStateReducer';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import HorzontalLine from '../general/horizonal_line';
import CustomButton from '../general/button';

type entryParams = {
    item: SetNode,
    saveSet: (sequenceNumber: number, reps?: number, weight?: number, duration?: string) => void
};

type exerciseParams = {
    exercise: ExerciseProps,
    navigateBack: (name: string, template_id?: string) => void,
    recordSet: (exercise_id: string, sequence_number: number, reps?: number, weight?: number, duration?: string) => void

};

export default function CurrentExercise({ exercise, navigateBack, recordSet }: exerciseParams) {
    const [currentSet, setCurrentSet] = useState(1);
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;

    function saveSet(sequenceNumber: number, reps?: number, weight?: number, duration?: string) {
        setCurrentSet(currentSet + 1);
        recordSet(exercise.id, sequenceNumber, reps, weight, duration);
    }

    function setSelectedSet(sequence_number: number) {
        setCurrentSet(sequence_number);
    }

    function handleNavigateBack() {
        navigateBack(ScreenOptions.MOVEMENT_LIST);
    }

    const SetEntry = ({ item, saveSet }: entryParams) => {
        const [reps, setReps] = useState(item.completedReps?.toString());
        const [weight, setWeight] = useState(item.weight?.toString());

        function handleOnSaveSet() {
            saveSet(item.sequenceNumber, Number(reps), Number(weight));
        }

        function handleOnSelect() {
            setSelectedSet(item.sequenceNumber);
        }

        return (
            <Pressable onPress={handleOnSelect}>
                <View style={baseStyles.spacedRow}>
                    <Text style={{ ...baseStyles.subHeader, color: color }}>Set {item.sequenceNumber} </Text>
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
                    </View>
                </View>
                {
                    currentSet == item.sequenceNumber &&
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

    return (
        <View>
            <View style={baseStyles.leftJustifiedRow}>
                <FontAwesome size={28} name="chevron-left" />
                <Button title="Execise List" onPress={handleNavigateBack} />
            </View>
            <Text style={{ ...baseStyles.mediumHeader, color: color }}>{exercise.movement.name}</Text>
            <FlatList
                data={exercise.sets}
                renderItem={({ item }) => <SetEntry item={item} saveSet={saveSet} />}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={HorzontalLine}
            />
        </View>
    );
}
