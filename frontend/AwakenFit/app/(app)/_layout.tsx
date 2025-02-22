import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, concat } from '@apollo/client';


import { useSession } from '../../auth/AuthContext';


const API_URL = process.env.EXPO_PUBLIC_API_URL;


export default function AppLayout() {
    const { session, isLoading } = useSession();

    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!session) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        return <Redirect href="/sign-in" />;
    }

    const httpLink = new HttpLink({ uri: `${API_URL}/api/graphql` });

    const authMiddleware = new ApolloLink((operation, forward) => {
        const decoded = JSON.parse(session);
        const token = decoded.token;
        operation.setContext({
            headers: {
                'X-Session-Token': token ? token : "",
            },
        });
        return forward(operation);
    });

    const client = new ApolloClient({
        link: concat(authMiddleware, httpLink),
        cache: new InMemoryCache()
    });

    // This layout can be deferred because it's not the root layout.
    return (
        <ApolloProvider client={client}>
            <Stack />
        </ApolloProvider>
    );
}
