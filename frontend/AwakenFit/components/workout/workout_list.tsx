import { useState } from 'react';
import { Text, Pressable, View, FlatList, useColorScheme } from 'react-native';
import { router } from 'expo-router';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import HorzontalLine from '../general/horizonal_line';
import CustomButton from '../general/button';

import MovementList from './movement_list';

type ExerciseProps = {
    id: string,
    notes: string,
    movement: {
        name: string,
        description: string,
        primaryMuscleGroup: string,
        equipmentType: string,
        movementType: string
    },
    sets: {
        id: string,
        sequenceNumber: number,
        minReps: number,
        maxReps: number,
        duration: string,
        setType: string,
        parentSet: string
    }[]
};

type WorkoutProps = {
    cursor: string,
    node: {
        id: string,
        name: string,
        notes: string,
        exercises: ExerciseProps[],
    }
};

type params = {
    workouts: WorkoutProps[],
    loading?: Boolean
}

export default function WorkoutList({ workouts, loading }: params) {
    const colorScheme = useColorScheme();

    const RowEntry = ({ node }: WorkoutProps) => {
        const [expanded, setExpanded] = useState(false);

        function toggleExpand() {
            setExpanded(!expanded);
        }


        function templateSelected() {
            if (expanded) {
                router.push({ pathname: '/(tabs)/workout', params: { id: node.id } });
            }
        }

        return (
            <>
                <CustomButton
                    text={node.name}
                    onPress={toggleExpand}
                    disabled={false}
                />
                {
                    expanded &&
                    <View>
                        <MovementList exercises={node.exercises} />
                        <View style={baseStyles.centeredRow}>
                            <CustomButton
                                text="Start Workout"
                                onPress={templateSelected}
                                disabled={false}
                            />
                        </View>
                    </View>
                }
            </>
        );
    };

    return (
        <View>
            <FlatList
                data={workouts}
                renderItem={({ item }) => <RowEntry cursor={item.cursor} node={item.node} />}
                keyExtractor={item => item.cursor}
                ItemSeparatorComponent={HorzontalLine}
            />
        </View>
    );
}
