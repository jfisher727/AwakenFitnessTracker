import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="create"
                options={{
                    title: "",
                    headerBackTitle: "Back",
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    title: "",
                    headerBackTitle: "Back",
                }}
            />
        </Stack>
    );
}
