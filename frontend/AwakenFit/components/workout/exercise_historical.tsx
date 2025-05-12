import { useState, useEffect } from 'react';
import { View, Text, Button, Pressable, FlatList, useColorScheme } from "react-native";

import { gql, useLazyQuery } from '@apollo/client';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import HorzontalLine from '../general/horizonal_line';

import { MovementNode } from '@/graphql/properties';

import { date_formatter } from '@/util/date';
import { hexToRGBA } from '@/util/color';


const GET_EXERCISE_HISTORICAL = gql`
    query GetExercises($movementId: String, $after: String, $before: String, $count: Int) {
        exercises(movementId: $movementId, after: $after, before: $before, first: $count) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            edges {
                node{
                    id
                    movement {
                        name
                        primaryMuscleGroup
                        equipmentType
                        movementType
                    }
                    workout {
                        startTime
                    }
                    sets {
                        id
                        sequenceNumber
                        completedReps
                        weight
                        duration
                        oneRepMax
                        volume
                    }
                }
            }
        }
    }
`;

type historicalParams = {
    movementId: string,
    navigateBack: () => void,
}

type ExerciseEntry = {
    node: ExerciseNode
}

type SetNode = {
    id: string,
    sequenceNumber: number,
    completedReps: number,
    duration: string,
    weight: number,
    oneRepMax: number,
    volume: number
}

type ExerciseNode = {
    id: string,
    movement: MovementNode,
    workout: {
        startTime: string
    },
    sets: SetNode[]
}

export default function ExerciseHistorical({ movementId, navigateBack }: historicalParams) {
    const colorScheme = useColorScheme();
    const [execute, { loading, error, data }] = useLazyQuery(GET_EXERCISE_HISTORICAL);
    const [name, setName] = useState('');
    const [index, setIndex] = useState(-1);
    const [body, setBody] = useState(<Text></Text>);

    const enabledColor = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;
    const disabledColor = hexToRGBA(enabledColor, 0.6);

    function handleNavigateBack() {
        navigateBack();
    }

    useEffect(() => {
        execute({ variables: { count: 10, movementId: movementId } });
    }, []);

    useEffect(() => {
        if (index === -1 && data) {
            setIndex(data?.exercises.edges.length - 1);
        }
    }, [data]);

    useEffect(() => {
        if (index !== -1 && data.exercises.edges[index]?.node) {
            setName(data.exercises.edges[index].node.movement.name);
            setBody(<WorkoutEntry node={data.exercises.edges[index].node} />);
        }
    }, [index]);

    const SetEntry = ({ id, sequenceNumber, completedReps, weight, oneRepMax, volume }: SetNode) => {
        return (
            <View style={{ ...baseStyles.spacedRow, padding: 10 }}>
                <Text style={{ color: enabledColor }}>{sequenceNumber}</Text>
                <Text style={{ color: enabledColor }}>{completedReps}</Text>
                <Text style={{ color: enabledColor }}>{weight}</Text>
                <Text style={{ color: enabledColor }}>{oneRepMax}</Text>
                <Text style={{ color: enabledColor }}>{volume}</Text>
            </View>
        );
    }

    const WorkoutEntry = ({ node }: ExerciseEntry) => {
        function previousPressed() {
            if (index === 0) {
                execute({ variables: { count: 10, movementId: movementId, before: data.exercises.pageInfo.startCursor } });
            }
            else {
                setIndex(index - 1);
            }
        }

        function nextPressed() {
            if (index === data.exercises.edges.length - 1) {
                execute({ variables: { count: 10, movementId: movementId, after: data.exercises.pageInfo.endCursor } });
            }
            else {
                setIndex(index + 1);
            }
        }

        const movement_type = node.movement.movementType.toLowerCase();
        const equipment_type = node.movement.equipmentType.toLowerCase();

        if (movement_type === "cardio") {
            return (
                <View style={baseStyles.modal}>
                    <Text>No historical data for cardio</Text>
                </View>
            );
        }
        if (equipment_type == "none" || equipment_type === "body only" || equipment_type === "exercise ball") {
            return (
                <View>
                    <Text>Reps Only</Text>
                </View>
            );
        }
        if (equipment_type == "resistance bands") {
            return (
                <View>
                    <Text>Reps and identifier</Text>
                </View>
            );
        }

        return (
            <View style={baseStyles.modal}>
                <View style={baseStyles.spacedRow}>
                    {
                        (index > 0 || data.exercises.pageInfo.hasPreviousPage) ?
                            <Pressable onPress={previousPressed} style={baseStyles.selectableRow} disabled={loading}>
                                <FontAwesome size={28} name="chevron-left" color={loading ? disabledColor : enabledColor} />
                                <Text style={{ color: loading ? disabledColor : enabledColor }}>Previous</Text>
                            </Pressable> :
                            <View></View>
                    }
                    {
                        (index < data.exercises.edges.length || data.exercises.pageInfo.hasNextPage) &&
                        <Pressable onPress={nextPressed} style={baseStyles.selectableRow} disabled={loading}>
                            <Text style={{ color: loading ? disabledColor : enabledColor }}>Next</Text>
                            <FontAwesome size={28} name="chevron-right" color={loading ? disabledColor : enabledColor} />
                        </Pressable>
                    }
                </View>
                <View style={baseStyles.centeredRow}>
                    <Text style={{ ...baseStyles.mediumHeader, color: enabledColor }}>{date_formatter(node.workout.startTime)}</Text>
                </View>
                <View style={baseStyles.spacedRow}>
                    <Text style={{ color: enabledColor }}>Set #</Text>
                    <Text style={{ color: enabledColor }}>Reps</Text>
                    <Text style={{ color: enabledColor }}>Weight</Text>
                    <Text style={{ color: enabledColor }}>1 Rep Max</Text>
                    <Text style={{ color: enabledColor }}>Volume</Text>
                </View>
                <FlatList
                    data={node.sets}
                    renderItem={({ item }) => <SetEntry
                        id={item.id}
                        sequenceNumber={item.sequenceNumber}
                        oneRepMax={item.oneRepMax}
                        duration={item.duration}
                        volume={item.volume}
                        completedReps={item.completedReps}
                        weight={item.weight}
                    />}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={HorzontalLine}
                />
            </View>
        );
    }


    return (
        <View>
            <View style={baseStyles.leftJustifiedRow}>
                <FontAwesome size={28} name="chevron-left" color={enabledColor} />
                <Button title="Current Exercise" onPress={handleNavigateBack} />
            </View>
            <View style={baseStyles.centeredRow}>
                <Text style={{ ...baseStyles.subHeader, color: enabledColor }}>{name} - Historical</Text>
            </View>
            {body}
        </View>
    );
}
