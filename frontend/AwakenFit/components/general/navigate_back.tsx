import { View, Text, Pressable, useColorScheme } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { baseStyles, darkColors, lightColors } from "@/styles/global";

type params = {
    label: string;
    onPress: any;
};

export default function NavigateBack({ label, onPress }: params) {
    const colorScheme = useColorScheme();

    const color =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;

    return (
        <Pressable onPress={onPress}>
            <View style={baseStyles.leftJustifiedRow}>
                <FontAwesome
                    size={28}
                    name="chevron-left"
                    style={{ color: color }}
                />
                <Text
                    style={{
                        fontSize: 25,
                        color: color,
                        paddingLeft: 10,
                    }}
                >
                    {label}
                </Text>
            </View>
        </Pressable>
    );
}
