import { useState } from 'react';
import { Text, View, FlatList, useColorScheme } from 'react-native';
import { router } from 'expo-router';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import { ExerciseProps, WorkoutProps } from '@/graphql/properties';

import HorzontalLine from '../general/horizonal_line';
import CustomButton from '../general/button';

type params = {
    workouts: WorkoutProps[],
    loading: Boolean
}

type exerciseParams = {
    exercises: ExerciseProps[],
}

const MovementEntry = (exercise: ExerciseProps) => {
    const colorScheme = useColorScheme();

    return (
        <View>
            <Text
                style={{
                    ...baseStyles.subHeader,
                    color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                }}
            >
                {exercise.movement.name}
            </Text>
            <FlatList
                data={exercise.sets}
                renderItem={({ item }) => <Text>Set # - {item.sequenceNumber} Min Reps {item.minReps} Max Reps {item.maxReps}</Text>}
                keyExtractor={item => item.id}
            />
        </View>);
}

function MovementList({ exercises }: exerciseParams) {
    return (
        <FlatList
            data={exercises}
            renderItem={({ item }) => <MovementEntry id={item.id} movement={item.movement} sets={item.sets} notes={item.notes} />}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={HorzontalLine}
        />
    );
}

export default function WorkoutList({ workouts }: params) {

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
