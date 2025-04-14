import { Text, View, FlatList, Pressable, useColorScheme } from 'react-native';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import { ExerciseProps } from '@/graphql/properties';
import HorzontalLine from '../general/horizonal_line';


type entryParams = {
    item: ExerciseProps,
    setCurrentExercise: (id: string) => void
}

const ExerciseEntry = ({ item, setCurrentExercise }: entryParams) => {
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;
    return (
        <Pressable style={baseStyles.button} onPress={() => setCurrentExercise(item.id)}>
            <View>
                <Text style={{ ...baseStyles.subHeader, color: textColor }}>{item.movement.name}</Text>
            </View>
            <View style={{ width: '60%' }}>
                <View style={baseStyles.spacedRow}>
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
            </View>
        </Pressable>
    );
}

type params = {
    exercises: ExerciseProps[],
    setCurrentExercise: (id: string) => void,
    removeExercise: (id: string) => void
};

export default function MovementList({ exercises, setCurrentExercise }: params) {
    const colorScheme = useColorScheme();

    return (
        <FlatList
            data={exercises}
            renderItem={({ item }) => <ExerciseEntry item={item} setCurrentExercise={setCurrentExercise} />}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={HorzontalLine}
        />
    );
}
