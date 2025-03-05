import { useState, useEffect } from 'react';
import { router, Redirect } from 'expo-router';
import { Text, View, useColorScheme, Platform } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';

import { useSession } from '@/auth/AuthContext';
import { baseStyles, lightColors, darkColors } from '@/styles/global';
import { setup, register, Client } from '@/auth/allauth';

import TextInputField from '@/components/text_input';
import CustomButton from '@/components/button';


export default function Register() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const { signIn } = useSession();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [response, setResponse] = useState({ fetching: false, content: null });

    useEffect(() => {
        navigation.setOptions({ headerShow: true, title: "Register" });
    }, [navigation]);

    useEffect(() => {
        setPasswordsMatch(password === confirmPassword);
    }, [password, confirmPassword]);

    var client = Client.BROWSER;
    if (Platform.OS !== "web") {
        client = Client.APP;
    }
    setup(client, true);

    async function registerPressed() {
        setResponse({ fetching: true, content: null });
        const response = await register({ email: email, username: username, password: password });
        setResponse({ fetching: false, content: response });
        if (response.status === 401) {
            // this is the expected(?) status response
            signIn(response.meta.session_token, username);
            router.replace('/account/verify_email');
        }
        else {
            // need to review the error message if the email is already taken or what not
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
                        Register
                    </Text>
                </View>
                <View style={{ paddingTop: '7%' }}>
                    <View style={baseStyles.modal}>
                        <TextInputField
                            onChangeText={setEmail}
                            defaultValue={email}
                            secureTextEntry={false}
                            inputMode="email"
                            header="Email"
                            showHeader={true}
                        />
                        <TextInputField
                            onChangeText={setUsername}
                            defaultValue={username}
                            secureTextEntry={false}
                            inputMode="text"
                            header="Username"
                            showHeader={true}
                        />
                        <TextInputField
                            onChangeText={setPassword}
                            defaultValue={password}
                            secureTextEntry={true}
                            inputMode="text"
                            header="Password"
                            showHeader={true}
                        />
                        <TextInputField
                            onChangeText={setConfirmPassword}
                            defaultValue={confirmPassword}
                            secureTextEntry={true}
                            inputMode="text"
                            header="Confirm Password"
                            showHeader={true}
                        />
                        {
                            !passwordsMatch ? (
                                <Text>Please make sure the passwords match</Text>
                            ) : (
                                <></>
                            )
                        }
                        <CustomButton text="Register" onPress={registerPressed} disabled={response.fetching || !passwordsMatch} />
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}
