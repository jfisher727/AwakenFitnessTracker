import { Stack } from "expo-router";

export default function WorkoutLayout() {
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
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="modal"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
