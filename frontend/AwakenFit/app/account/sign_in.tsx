import { useState, useEffect } from 'react';
import { router, Link } from 'expo-router';
import { Text, View, useColorScheme, Platform } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';

import { useSession } from '@/auth/AuthContext';
import { baseStyles, lightColors, darkColors } from '@/styles/global';
import { setup, login, Client } from '@/auth/allauth';

import TextInputField from '@/components/text_input';
import CustomButton from '@/components/button';


export default function SignIn() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const { signIn } = useSession();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState({ fetching: false, content: null });

    useEffect(() => {
        navigation.setOptions({ headerShow: true, title: "Sign In" });
    }, [navigation]);

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
        <SafeAreaProvider style={baseStyles.parent}>
            <SafeAreaView
                style={{
                    ...baseStyles.container,
                    backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
                }}>
                <View>
                    <Text
                        style={{
                            ...baseStyles.header,
                            color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                        }}>
                        AwakenFit
                    </Text>
                    <Text
                        style={{
                            ...baseStyles.subHeader,
                            color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.accent
                        }}>
                        Sign In
                    </Text>
                </View>
                <View style={{ paddingTop: '15%' }}>
                    <View style={baseStyles.modal}>
                        <TextInputField
                            onChangeText={setEmail}
                            defaultValue={email}
                            secureTextEntry={false}
                            inputMode="email"
                            header="Email"
                        />
                        <TextInputField
                            onChangeText={setPassword}
                            defaultValue={password}
                            secureTextEntry={true}
                            inputMode="text"
                            header="Password"
                        />
                        <CustomButton text="Login" onPress={loginPressed} disabled={response.fetching} />
                        <Link
                            href="/account/forgotten_password"
                            asChild
                        >
                            <CustomButton text="ForgottenPassword" />
                        </Link>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}
