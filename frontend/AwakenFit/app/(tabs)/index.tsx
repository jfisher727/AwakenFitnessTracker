import { Text, View, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { useSession } from '@/auth/AuthContext';
import { baseStyles, lightColors, darkColors } from '@/styles/global';
import StartWorkout from '@/components/start_workout';
import WeekReview from '@/components/week_review';
import HorzontalLine from '@/components/horizonal_line';
import CustomButton from '@/components/button';


export default function Index() {
    const colorScheme = useColorScheme();
    const { session } = useSession();

    var decoded;
    if (session) {
        decoded = JSON.parse(session);
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
                    Welcome, you're logged in!
                </Text>
                <View style={baseStyles.modal}>
                    <StartWorkout />
                    <HorzontalLine />
                    <WeekReview />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
