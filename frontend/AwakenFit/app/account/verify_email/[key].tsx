import { Text, View, useColorScheme } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { baseStyles, lightColors, darkColors } from '@/styles/global';


export default function VerifyEmail() {
    const colorScheme = useColorScheme();
    const { key } = useLocalSearchParams();

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
                <View style={{
                    ...baseStyles.modal
                }}>
                    <Text>{key}</Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
