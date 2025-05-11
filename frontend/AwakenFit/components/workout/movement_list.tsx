import { Text, View, FlatList, Pressable, useColorScheme } from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import { ExerciseProps, SetNode } from '@/graphql/properties';
import HorzontalLine from '../general/horizonal_line';


type entryParams = {
    item: ExerciseProps,
    index: number,
    editable: boolean,
    removeExercise: (id: string) => void,
    setCurrentExercise: (id: string) => void,
}

type setEntryParams = {
    entry: SetNode
}

type params = {
    exercises: ExerciseProps[],
    editable: boolean,
    showSets: boolean,
    moveExerciseUp: (index: number) => void,
    moveExerciseDown: (index: number) => void,
    setCurrentExercise: (id: string) => void,
    removeExercise: (id: string) => void,
};

export default function MovementList({ exercises, editable, showSets, moveExerciseUp, moveExerciseDown, setCurrentExercise, removeExercise }: params) {

    const ExerciseEntry = ({ item, index, editable, removeExercise, setCurrentExercise }: entryParams) => {
        const colorScheme = useColorScheme();
        const textColor = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;

        const SetEntry = ({ entry }: setEntryParams) => {
            const equipment_type = item.movement.equipmentType;
            const movement_type = item.movement.movementType;
            if (equipment_type === "none" || equipment_type === "body only" || equipment_type === "exercise ball") {
                if (movement_type === "cardio") {
                    return (
                        <View style={baseStyles.spacedRow}>
                            <Text style={{ color: textColor }}>Set {entry.sequenceNumber}:</Text>
                            <Text style={{ color: textColor }}>Duration: {entry.duration}</Text>
                        </View>
                    );
                }
            }
            return (
                <View style={baseStyles.spacedRow}>
                    <Text style={{ color: textColor }}>Set {entry.sequenceNumber}:</Text>
                    <Text style={{ color: textColor }}>Min Reps: {entry.minReps}</Text>
                    <Text style={{ color: textColor }}>Max Reps: {entry.maxReps}</Text>
                </View>
            );
        }

        return (
            <Pressable style={baseStyles.selectableRow} onPress={() => setCurrentExercise(item.id)}>
                {
                    editable ?
                        <View style={baseStyles.centeredColumn}>
                            <Pressable onPress={() => moveExerciseUp(index)}>
                                <FontAwesome size={28} name="chevron-up" color={textColor} />
                            </Pressable>
                            <Pressable onPress={() => moveExerciseDown(index)}>
                                <FontAwesome size={28} name="chevron-down" color={textColor} />
                            </Pressable>
                        </View> :
                        <></>
                }
                <View style={{ ...baseStyles.centeredColumn, width: '80%' }}>
                    <View style={baseStyles.centeredRow}>
                        <Text style={{ ...baseStyles.subHeader, color: textColor }}>{item.movement.name}</Text>
                    </View>
                    <View>
                        <View style={{ ...baseStyles.spacedRow, width: '100%' }}>
                            <Text style={{ color: textColor }}>Muscle Group:</Text>
                            <Text style={{ color: textColor }}>{item.movement.primaryMuscleGroup}</Text>
                        </View>
                        <View style={baseStyles.spacedRow}>
                            <Text style={{ color: textColor }}>Equipment:</Text>
                            <Text style={{ color: textColor }}>{item.movement.equipmentType}</Text>
                        </View>
                        <View style={baseStyles.spacedRow}>
                            <Text style={{ color: textColor }}>Exercise Type:</Text>
                            <Text style={{ color: textColor }}>{item.movement.movementType}</Text>
                        </View>
                        {
                            showSets &&
                            <>
                                <FlatList
                                    data={item.sets}
                                    renderItem={({ item }) => <SetEntry entry={item} />}
                                    keyExtractor={item => item.id}
                                />
                            </>
                        }
                    </View>
                </View>
                {
                    editable ?
                        <View style={baseStyles.centeredColumn}>
                            <Pressable onPress={() => removeExercise(item.id)}>
                                <FontAwesome size={28} name="trash" color={textColor} />
                            </Pressable>
                        </View> :
                        <></>
                }
            </Pressable>
        );
    }

    return (
        <FlatList
            data={exercises}
            renderItem={({ item, index }) =>
                <ExerciseEntry
                    item={item}
                    index={index}
                    editable={editable}
                    removeExercise={removeExercise}
                    setCurrentExercise={setCurrentExercise} />}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={HorzontalLine}
        />
    );
}
