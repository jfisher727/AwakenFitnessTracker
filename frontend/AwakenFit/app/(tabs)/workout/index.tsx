import { Text, TextInput, View, FlatList, useColorScheme } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { gql, useQuery } from '@apollo/client';

const GET_WORKOUT = gql`
    query GetWorkout($id: ID!) {
        workout(id: $id) {
            id
            name
            notes
            exercises {
                id
                notes
                movement {
                    name
                    description
                    primaryMuscleGroup
                    equipmentType
                    movementType
                }
                sets {
                    id
                    sequenceNumber
                    minReps
                    maxReps
                    duration
                    setType
                }
            }
        }
    }
`;

export default function Workout() {
    const params = useLocalSearchParams();
    const { loading, error, data } = useQuery(GET_WORKOUT, {
        variables: { id: params.id }
    });


    if (!params) {
        console.log("Blank workout");
    }

    if (loading) {

    }

    if (error) {
        console.log(error);
    }

    if (data) {
        console.log(data);
    }

    return (
        <View>
            <Text>Workout Index Page</Text>
        </View>
    );
}
