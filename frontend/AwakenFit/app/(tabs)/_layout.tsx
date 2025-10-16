import { useColorScheme } from "react-native";
import { Redirect, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
    ApolloLink,
    concat,
} from "@apollo/client";

import { useSession } from "../../auth/AuthContext";

import { darkColors, lightColors } from "@/styles/global";

import Spinner from "@/components/general/spinner";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TabsLayout() {
    const { session, isLoading } = useSession();
    const colorScheme = useColorScheme();

    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return <Spinner />;
    }

    // Only require authentication within the (tabs) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!session) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        return <Redirect href="/welcome" />;
    }

    const httpLink = new HttpLink({ uri: `${API_URL}/api/graphql` });

    const authMiddleware = new ApolloLink((operation, forward) => {
        const decoded = JSON.parse(session);
        const token = decoded.token;
        operation.setContext({
            headers: {
                "X-Session-Token": token ? token : "",
            },
        });
        return forward(operation);
    });

    const client = new ApolloClient({
        link: concat(authMiddleware, httpLink),
        cache: new InMemoryCache(),
    });

    // This layout can be deferred because it's not the root layout.
    return (
        <ApolloProvider client={client}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor:
                        colorScheme === "light"
                            ? lightColors.primaryColor
                            : darkColors.primaryColor,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color }) => (
                            <FontAwesome size={28} name="home" color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="management"
                    options={{
                        title: "Workout",
                        tabBarIcon: ({ color }) => (
                            <FontAwesome
                                size={28}
                                name="gamepad"
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ color }) => (
                            <FontAwesome size={28} name="cog" color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="workout"
                    options={{
                        href: null,
                        tabBarStyle: { display: "none" },
                    }}
                />
            </Tabs>
        </ApolloProvider>
    );
}
