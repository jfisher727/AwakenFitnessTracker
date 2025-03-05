import { TextInput, Text, View } from 'react-native';

import { baseStyles, darkColors } from '@/styles/global';

type params = {
    inputMode: any,
    onChangeText: any,
    defaultValue: string,
    secureTextEntry: boolean,
    header: string,
    showHeader: boolean
}
export default function TextInputField({ inputMode, onChangeText, defaultValue, secureTextEntry, header, showHeader }: params) {
    return (
        <View style={{
            ...baseStyles.shadowBox,
        }}>
            {
                showHeader &&
                <Text style={{ fontSize: 24, color: darkColors.background }}>{header}</Text>
            }
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
