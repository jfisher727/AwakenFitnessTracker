import { useState } from 'react';
import { router } from 'expo-router';
import { Text, View, Pressable, useColorScheme, Platform } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { lightColors, darkColors } from '@/styles/global';
import { setup, forgottenPassword, Client } from '@/auth/allauth';

import TextInputField from '@/components/general/text_input';
import CustomButton from '@/components/general/button';


export default function ForgottenPassword() {
    const colorScheme = useColorScheme();

    const [email, setEmail] = useState('');
    const [response, setResponse] = useState({ fetching: false, content: null });

    var client = Client.BROWSER;
    if (Platform.OS !== "web") {
        client = Client.APP;
    }
    setup(client, true);

    async function submitPressed() {
        setResponse({ fetching: true, content: null });
        const response = await forgottenPassword({ email: email });
        setResponse({ fetching: false, content: response });
        if (response.status === 200) {
            router.replace('/');
        }
    }


    return (
        <SafeAreaProvider style={{ marginBottom: '4%' }}>
            <SafeAreaView
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
                }}>
                <View>
                    <Text
                        style={{
                            fontSize: 50,
                            margin: 10,
                            fontWeight: "bold",
                            color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                        }}>
                        AwakenFit
                    </Text>
                    <Text
                        style={{
                            fontSize: 30,
                            margin: 10,
                            color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.accent
                        }}>
                        Forgotten Password
                    </Text>
                </View>
                <View style={{ paddingTop: '15%' }}>
                    <View style={{ borderRadius: 10, backgroundColor: "#FFFFFF", padding: 10, margin: 10 }}>
                        <TextInputField
                            onChangeText={setEmail}
                            defaultValue={email}
                            secureTextEntry={false}
                            inputMode="email"
                            header="Email"
                        />
                        <CustomButton text='Submit' onPress={submitPressed} disabled={false} />
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
