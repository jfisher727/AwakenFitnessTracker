import { useState, useEffect } from 'react';
import { router, Link } from 'expo-router';
import { Text, View, Pressable, useColorScheme, Platform } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';

import { useSession } from '@/auth/AuthContext';
import { baseStyles, lightColors, darkColors } from '@/styles/global';
import { setup, login, Client } from '@/auth/allauth';

import CustomButton from '@/components/button';


export default function Welcome() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShow: false });
    }, [navigation]);


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
                        <Link href="account/sign_in" asChild>
                            <CustomButton text="Sign In" />
                        </Link>
                        <Link href="account/register" asChild>
                            <CustomButton text="Register" />
                        </Link>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}
