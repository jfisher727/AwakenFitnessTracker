import { Stack } from "expo-router";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://192.168.1.10:8000/api/graphql',
  cache: new InMemoryCache()
});

export default function RootLayout() {

  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack>
    </ApolloProvider>);
}
