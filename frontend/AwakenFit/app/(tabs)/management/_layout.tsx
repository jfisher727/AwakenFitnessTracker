import { Stack } from "expo-router";


export default function ManagementLayout() {

    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerShown: false
            }} />
            <Stack.Screen name="templates" options={{
                headerShown: false
            }} />
        </Stack>
    );
}
