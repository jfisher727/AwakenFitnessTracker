import { Text, View, FlatList, useColorScheme } from 'react-native';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import HorzontalLine from '../general/horizonal_line';

import { ExerciseProps } from '@/workout/properties';


type params = {
    exercises: ExerciseProps[],
};

export default function MovementList({ exercises }: params) {
    const colorScheme = useColorScheme();

    return (
        <Text>Movement List</Text>
    );
}
