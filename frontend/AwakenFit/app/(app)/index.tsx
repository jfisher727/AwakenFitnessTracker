import { Text, View, FlatList, useColorScheme, Button } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { gql, useQuery } from '@apollo/client';

import { useSession } from '@/auth/AuthContext';
import { globalStyles, lightColors, darkColors } from '@/styles/global';

const TEST_QUERY = gql`
  {
    movements(primaryMuscleGroup:"Triceps") {
      edges {
        node {
          id
          name
          description
          equipmentType
        }
      }
    }
  }
`;


export default function Index() {
    const colorScheme = useColorScheme();
    const { session, signOut } = useSession();
    const { loading, error, data } = useQuery(TEST_QUERY);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error! {error.message}</Text>;

    var decoded;
    if (session) {
        decoded = JSON.parse(session);
    }

    function logoutPressed() {
        signOut();
    }
    /*

                <View>
                    <FlatList
                        data={data.movements.edges}
                        keyExtractor={(item) => item.node.id.toString()}
                        renderItem={({ item }) => (
                            <View style={{ padding: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.node.name}</Text>
                                <Text>{item.node.category}</Text>
                            </View>
                        )}
                    />
                </View>

    */

    return (
        <SafeAreaProvider>
            <SafeAreaView style={globalStyles.lightContainer}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text>
                        Welcome, you're logged in!
                    </Text>
                    <Text> {decoded.username} </Text>
                    <Text> {decoded.token} </Text>
                </View>
                <View>
                    <Button title="Log Out" onPress={logoutPressed} color={colorScheme === 'light' ? lightColors.secondaryColor : darkColors.secondaryColor} />
                </View>
                <View>
                    <FlatList
                        data={data.movements.edges}
                        keyExtractor={(item) => item.node.id.toString()}
                        renderItem={({ item }) => (
                            <View style={{ padding: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.node.name}</Text>
                                <Text>{item.node.category}</Text>
                            </View>
                        )}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
