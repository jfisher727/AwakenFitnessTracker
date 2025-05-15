import { useState } from 'react';
import { Text, View, useColorScheme, Platform } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { useSession } from '@/auth/AuthContext';
import { verifyEmail, Client, setup } from '@/auth/allauth';

import TextInputField from '@/components/general/text_input';
import CustomButton from '@/components/general/button';
import Spinner from '@/components/general/spinner';

import { baseStyles, lightColors, darkColors } from '@/styles/global';


export default function VerifyEmail() {
    const colorScheme = useColorScheme();
    const { session } = useSession();

    const [key, setKey] = useState('');
    const [response, setResponse] = useState({ fetching: false, content: '' });

    function verifyEmailPressed() {
        var client = Client.BROWSER;
        if (Platform.OS !== "web") {
            client = Client.APP;
        }
        setup(client, true);

        var verifyResponse = '';
        const sendRequest = async () => {
            if (session) {
                const decoded = JSON.parse(session);
                verifyResponse = await verifyEmail({ "key": key }, decoded.token);
                console.log(response);
            }
        };

        setResponse({ fetching: true, content: '' });
        sendRequest();
        setResponse({ fetching: false, content: verifyResponse });
    };


    return (
        <SafeAreaProvider style={baseStyles.parent}>
            <SafeAreaView style={{
                ...baseStyles.container,
                backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
            }}>
                <Text
                    style={{
                        ...baseStyles.header,
                        color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                    }}>
                    Verify Your Email
                </Text>
                {
                    response.fetching ?
                        <Spinner /> :
                        <View style={{
                            ...baseStyles.modal
                        }}>
                            <TextInputField
                                onChangeText={setKey}
                                defaultValue={key}
                                secureTextEntry={false}
                                inputMode="text"
                                header="Code from Email"
                                showHeader={true}
                            />
                            <CustomButton text="Verify Email" onPress={verifyEmailPressed} disabled={response.fetching} />
                        </View>
                }
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
