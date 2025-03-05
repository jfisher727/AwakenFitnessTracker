import { useState, useEffect } from 'react';
import { Text, View, FlatList, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { gql, useLazyQuery } from '@apollo/client';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import DropdownSelect from '@/components/dropdown_select';

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
                            primaryMuscleGroup
                            equipmentType
                            movementType
                        }
                    }
            }
    }
`;

type MovementProps = { cursor: string, node: { id: string, name: string, primaryMuscleGroup: string, equipmentType: String, movementType: String } }

const RowEntry = ({ node }: MovementProps) => {
    return (
        <View>
            <Text>{node.name}</Text>
        </View>
    );
}


export default function Calendar() {
    const colorScheme = useColorScheme();

    const [execute, { loading, error, data }] = useLazyQuery(GET_MOVEMENTS);

    const [selectedEquipment, setSelectedEquipment] = useState({ key: '', value: '' });
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState({ key: '', value: '' });
    const equipmentOptions: { key: string, value: string }[] = [{ key: 'Barbell', value: 'Barbell' }, { key: 'Dumbbell', value: 'Dumbbell' }];
    const muscleGroupOptions: { key: string, value: string }[] = [{ key: 'Abdominals', value: 'Abdominals' }, { key: 'Biceps', value: 'Biceps' }, { key: 'Chest', value: 'Chest' }];

    useEffect(() => {
        console.log(selectedEquipment);
        console.log(selectedMuscleGroup);
        execute({
            variables:
            {
                count: 20,
                equipment: selectedEquipment.value,
                muscle: selectedMuscleGroup.value
            }
        });

    }, [selectedEquipment, selectedMuscleGroup]);

    useEffect(() => {
        execute({ variables: { count: 20 } });
    }, []);


    if (loading) {
        return <Text>Loading...</Text>;
    }
    if (error) {
        console.log(error);
        return <Text>Error...</Text>;
    }

    return (
        <SafeAreaProvider style={baseStyles.parent}>
            <SafeAreaView style={{
                ...baseStyles.container,
                backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
            }}>
                <Text
                    style={{
                        ...baseStyles.header,
                        color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                    }}>
                    Welcome, to your calendar
                </Text>
                <View style={{
                    ...baseStyles.modal
                }}>
                    <Text>Temporary</Text>
                    <DropdownSelect
                        placeHolder='Equipment'
                        options={equipmentOptions}
                        onSelect={setSelectedEquipment}
                        showSearch={false}
                    />
                    <DropdownSelect
                        placeHolder='Muscle Group'
                        options={muscleGroupOptions}
                        onSelect={setSelectedMuscleGroup}
                        showSearch={true}
                    />
                    <Text>Yay</Text>
                    <Text>{selectedEquipment.value}</Text>
                    <Text>{selectedMuscleGroup.value}</Text>
                    {
                        data &&
                        <FlatList
                            data={data.movements.edges}
                            renderItem={({ item }) => <RowEntry cursor={item.cursor} node={item.node} />}
                            keyExtractor={item => item.cursor}
                        />
                    }
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
