import { useState, useEffect } from 'react';
import { Text, TextInput, View, Pressable, FlatList, useColorScheme } from 'react-native';

import { gql, useLazyQuery } from '@apollo/client';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import DropdownSelect from '@/components/general/dropdown_select';
import HorzontalLine from '../general/horizonal_line';

const GET_MOVEMENTS = gql`
    query GetMovements(
        $after: String,
        $name: String,
        $count: Int,
        $equipment: String,
        $muscle: String) {
            movements(
                after: $after,
                name_Icontains: $name,
                first: $count,
                equipmentType: $equipment,
                primaryMuscleGroup: $muscle) {
                    edges {
                        cursor
                        node {
                            id
                            name
                            description
                            primaryMuscleGroup
                            equipmentType
                            movementType
                        }
                    }
            }
    }
`;

type QueryVariables = {
    after?: string,
    name?: string,
    count: number,
    equipment?: string,
    muscle?: string
};

type MomvementNode = {
    id: string,
    name: string,
    description: string,
    primaryMuscleGroup: string,
    equipmentType: String,
    movementType: String
};

type MovementProps = {
    cursor: string,
    node: MomvementNode
};

type KeyValuePair = {
    key: string,
    value: string
};

const equipmentOptions: KeyValuePair[] = [
    { key: 'Barbell', value: 'Barbell' },
    { key: 'Body Only', value: 'Body Only' },
    { key: 'Cable', value: 'Cable' },
    { key: 'Dumbbell', value: 'Dumbbell' },
    { key: 'Exercise Ball', value: 'EZ-Curl Bar' },
    { key: 'Kettlebell', value: 'Kettlebell' },
    { key: 'Machine', value: 'Machine' },
    { key: 'Medicine Ball', value: 'Medicine Ball' },
    { key: 'None', value: 'None' },
    { key: 'Resistence Bands', value: 'Resistence Bands' },
];


const muscleGroupOptions: KeyValuePair[] = [
    { key: 'Abdominals', value: 'Abdominals' },
    //{ key: 'Back', value: 'Back' },
    { key: 'Biceps', value: 'Biceps' },
    { key: 'Calf', value: 'Calf' },
    { key: 'Chest', value: 'Chest' },
    { key: 'Forearm', value: 'Forearm' },
    { key: 'Glutes', value: 'Glutes' },
    { key: 'Hamstring', value: 'Hamstring' },
    { key: 'Lats', value: 'Lats' },
    { key: 'None', value: 'None' },
    { key: 'Quadriceps', value: 'Quadriceps' },
    { key: 'Shoulders', value: 'Shoulders' },
    { key: 'Trapezius', value: 'Trapezius' },
    { key: 'Triceps', value: 'Triceps' },
];

const DEBOUNCE_DELAY: number = 500; // milliseconds

interface ExerciseSearchProps {
    addExercise: (movement: MomvementNode) => void;
}

export default function ExerciseSearch({ addExercise }: ExerciseSearchProps) {
    const colorScheme = useColorScheme();

    const [execute, { loading, error, data }] = useLazyQuery(GET_MOVEMENTS);

    const [name, setName] = useState('Search');
    const [debouncedName, setDebouncedName] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState({ key: '', value: '' });
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState({ key: '', value: '' });

    const RowEntry = ({ node }: MovementProps) => {
        console.log(node.name);
        return (
            <Pressable style={baseStyles.selectableRow} onPress={() => addExercise(node)}>
                <Text style={{ color: lightColors.primaryColor, fontSize: 20 }}>{node.name}</Text>
            </Pressable>
        );
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (name.length == 0) {
                setName("Search");
            }
            setDebouncedName(name);
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timeoutId);
    }, [name]);

    useEffect(() => {
        const variables: QueryVariables = { count: 20 };
        if (debouncedName.length >= 3 && debouncedName != "Search") {
            variables.name = debouncedName;
        }
        if (selectedEquipment.value.length > 0) {
            variables.equipment = selectedEquipment.value;
        }
        if (selectedMuscleGroup.value.length > 0) {
            variables.muscle = selectedMuscleGroup.value;
        }
        execute({
            variables: variables
        });

    }, [selectedEquipment, selectedMuscleGroup, debouncedName]);

    useEffect(() => {
        execute({ variables: { count: 20 } });
    }, []);

    if (error) {
        console.log(error);
        return <Text>Error...</Text>;
    }

    return (
        <>
            <Text
                style={{
                    ...baseStyles.subHeader,
                    color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                }}>
                Search for Exercises
            </Text>
            <View style={{
                ...baseStyles.modal
            }}>
                <View style={{ ...baseStyles.modal, borderWidth: 1, borderColor: darkColors.background, margin: 2 }}>
                    <TextInput
                        inputMode="text"
                        defaultValue={name}
                        onChangeText={newText => setName(newText)}
                        style={{
                            ...baseStyles.selectHeader,
                            color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                        }}
                    />
                </View>
                <DropdownSelect
                    placeHolder='Equipment'
                    selectedValue={selectedEquipment}
                    options={equipmentOptions}
                    onSelect={setSelectedEquipment}
                    showSearch={false}
                />
                <DropdownSelect
                    placeHolder='Muscle Group'
                    selectedValue={selectedMuscleGroup}
                    options={muscleGroupOptions}
                    onSelect={setSelectedMuscleGroup}
                    showSearch={false}
                />
                {
                    data &&
                    <View style={baseStyles.flatListContainer}>
                        <FlatList
                            data={data.movements.edges}
                            renderItem={({ item }) => <RowEntry cursor={item.cursor} node={item.node} />}
                            keyExtractor={item => item.cursor}
                            refreshing={loading}
                            ItemSeparatorComponent={HorzontalLine}
                        />
                    </View>
                }
            </View>
        </>
    );
    /*


                    <ScrollView style={baseStyles.flatListContainer}>
                        {
                            data.movements?.edges.map((item: MovementProps) => (
                                <RowEntry cursor={item.cursor} node={item.node} key={item.cursor} />
                            ))
                        }
                    </ScrollView>
    */
}
