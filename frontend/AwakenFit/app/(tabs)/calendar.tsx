import { Text, View, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { useSession } from '@/auth/AuthContext';
import { baseStyles, lightColors, darkColors } from '@/styles/global';
import CustomButton from '@/components/button';


export default function Calendar() {
    const colorScheme = useColorScheme();

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
                    Welcome, to your calendar
                </Text>
                <View style={{
                    ...baseStyles.modal
                }}>
                    <Text>Temporary</Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
