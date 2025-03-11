import { Text, View, FlatList, useColorScheme } from 'react-native';

import HorzontalLine from '../general/horizonal_line';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

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

type params = {
    exercises: ExerciseProps[],
};

export default function MovementList({ exercises }: params) {
    const colorScheme = useColorScheme();

    const MovementEntry = (exercise: ExerciseProps) => {
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

    return (
        <FlatList
            data={exercises}
            renderItem={({ item }) => <MovementEntry id={item.id} movement={item.movement} sets={item.sets} notes={item.notes} />}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={HorzontalLine}
        />
    );


}
