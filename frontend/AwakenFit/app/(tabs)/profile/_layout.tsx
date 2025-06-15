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
                name="template_workout"
                options={{
                    title: "",
                    headerBackTitle: "Back",
                }}
            />
            <Stack.Screen
                name="movement"
                options={{
                    title: "",
                    headerBackTitle: "Back",
                }}
            />
        </Stack>
    );
}
