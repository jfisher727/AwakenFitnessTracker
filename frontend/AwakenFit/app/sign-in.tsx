import { useState } from 'react';
import { router } from 'expo-router';
import { Text, TextInput, View, Button, useColorScheme, Platform } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { useSession } from '@/auth/AuthContext';
import { globalStyles, lightColors, darkColors } from '@/styles/global';
import { setup, login, Client } from '@/auth/allauth';


export default function SignIn() {
    const colorScheme = useColorScheme();
    const { signIn } = useSession();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState({ fetching: false, content: null });

    var client = Client.BROWSER;
    if (Platform.OS !== "web") {
        client = Client.APP;
    }
    setup(client, true);

    async function loginPressed() {
        setResponse({ fetching: true, content: null });
        const response = await login({ email: email, password: password });
        setResponse({ fetching: false, content: response });
        if (response.status === 200) {
            signIn(response.meta.session_token, response.data.user.username);
            router.replace('/');
        }
    }


    return (
        <SafeAreaProvider>
            <SafeAreaView style={globalStyles.lightContainer}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text>
                        Sign In
                    </Text>
                </View>
                <View>
                    <Text>Email</Text>
                    <TextInput
                        placeholder="email"
                        onChangeText={newText => setEmail(newText)}
                        defaultValue={email}
                        inputMode="email"
                    />
                </View>
                <View>
                    <Text>Password</Text>
                    <TextInput
                        placeholder="password"
                        onChangeText={newText => setPassword(newText)}
                        defaultValue={password}
                        secureTextEntry={true}
                    />
                </View>
                <View>
                    <Button title="Login" onPress={loginPressed} color={colorScheme === 'light' ? lightColors.secondaryColor : darkColors.secondaryColor} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
