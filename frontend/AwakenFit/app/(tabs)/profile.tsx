import { Text, View, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useSession } from '@/auth/AuthContext';
import { baseStyles, lightColors, darkColors } from '@/styles/global';
import CustomButton from '@/components/general/button';


export default function Profile() {
    const colorScheme = useColorScheme();
    const { signOut } = useSession();

    function logoutPressed() {
        signOut();
    }

    function verifyEmailPressed() {
        router.navigate('/account/verify_email');
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                ...baseStyles.container,
                backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
            }}>
                <Text
                    style={{
                        ...baseStyles.header,
                        color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                    }}>
                    Welcome, to your profile
                </Text>
                <View style={{
                    ...baseStyles.modal
                }}>
                    <CustomButton text="Verify Email" onPress={verifyEmailPressed} disabled={false} />
                    <CustomButton text="Logout" onPress={logoutPressed} disabled={false} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
