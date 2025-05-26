import { Text, Pressable, useColorScheme, } from 'react-native';

import { baseStyles, darkColors, lightColors } from '@/styles/global';

type params = {
    text: string,
    onPress: any,
    disabled: boolean
}

export default function CustomButton({ text, onPress, disabled }: params) {
    const colorScheme = useColorScheme();
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={{
                ...baseStyles.button,
                backgroundColor: colorScheme === 'light' ? lightColors.secondaryColor : darkColors.secondaryColor
            }}>
            <Text
                style={{
                    fontSize: 25,
                    color: colorScheme === 'light' ? lightColors.buttonText : darkColors.buttonText
                }}>{text}</Text>
        </Pressable>
    );
}
