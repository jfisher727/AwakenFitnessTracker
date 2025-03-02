import { useEffect } from 'react';
import { router } from 'expo-router';
import { Text, View, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';

import { baseStyles, lightColors, darkColors } from '@/styles/global';
import CustomButton from '@/components/button';


export default function Welcome() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShow: false });
    }, [navigation]);

    function registerPressed() {
        router.navigate(href = "/account/register");
    }

    function signInPressed() {
        router.navigate(href = "/account/sign_in");
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
                        Welcome
                    </Text>
                </View>
                <View style={{ paddingTop: '15%' }}>
                    <View style={baseStyles.modal}>
                        <CustomButton text="Sign In" onPress={signInPressed} disabled={false} />
                        <CustomButton text="Register" onPress={registerPressed} disabled={false} />
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}
