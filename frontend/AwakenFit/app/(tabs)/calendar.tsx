import { useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import ExerciseSearch from '@/components/workout/exercise_search';




export default function Calendar() {
    const colorScheme = useColorScheme();

    return (
        <SafeAreaProvider style={baseStyles.parent}>
            <SafeAreaView style={{
                ...baseStyles.container,
                backgroundColor: colorScheme === 'light' ? lightColors.background : darkColors.background
            }}>
                <ExerciseSearch />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
