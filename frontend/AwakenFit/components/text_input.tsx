import { TextInput, Text, View } from 'react-native';

import { baseStyles, darkColors } from '@/styles/global';

type params = {
    inputMode: any,
    onChangeText: any,
    defaultValue: string,
    secureTextEntry: boolean,
    header: string
}
export default function TextInputField({ inputMode, onChangeText, defaultValue, secureTextEntry, header }: params) {
    return (
        <View style={{
            ...baseStyles.shadowBox,
        }}>
            <Text style={{ fontSize: 24, color: darkColors.background }}>{header}</Text>
            <TextInput
                onChangeText={newText => onChangeText(newText)}
                defaultValue={defaultValue}
                inputMode={inputMode}
                secureTextEntry={secureTextEntry}
                style={{ fontSize: 20 }}
            />
        </View>
    );
}
