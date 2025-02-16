import { Text, View, FlatList } from "react-native";
import { gql, useQuery } from '@apollo/client';

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
  const { loading, error, data } = useQuery(TEST_QUERY);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;
  return (
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
  );
}
