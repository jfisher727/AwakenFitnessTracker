import { View, Pressable, Text, useColorScheme } from 'react-native';
import { useState } from "react";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { baseStyles, darkColors, lightColors } from '@/styles/global';
import TextInputField from './text_input';


type keyvalue = {
    key: string,
    value: string
}

type params = {
    placeHolder: string,
    options: keyvalue[],
    onSelect: any,
    showSearch: boolean,
}

export default function DropdownSelect({ placeHolder, options, onSelect, showSearch = false }: params) {
    const colorScheme = useColorScheme();

    const [showMenu, setShowMenu] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedValue, setSelectedValue] = useState({ key: '', value: '' });
    let filteredOptions = [...options];
    if (showSearch && searchText.length >= 3) {
        filteredOptions = options.filter((option) => {
            return option.value.toLowerCase().includes(searchText.toLowerCase());
        });
    }

    const selectedBackgroundColor = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;


    function handleInputClick() {
        setShowMenu(!showMenu);
    }

    const getDisplay = () => {
        if (selectedValue.key !== '') {
            return selectedValue.value;
        }
        return placeHolder;
    };

    const onItemClick = (option: keyvalue) => {
        setSelectedValue(option);
        onSelect({ key: option.key, value: option.value });
        setShowMenu(false);
    };

    const isSelected = (option: keyvalue) => {
        if (!selectedValue.key) {
            return false;
        }

        return selectedValue.key === option.key;
    }

    return (
        <View style={{ ...baseStyles.modal, borderWidth: 1, borderColor: darkColors.background, margin: 2 }}>
            <Pressable onPress={handleInputClick}>
                <View style={baseStyles.spacedRow}>

                    <Text style={{
                        ...baseStyles.selectHeader,
                        color: colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor
                    }}>{getDisplay()}</Text>
                    {
                        showMenu ?
                            <FontAwesome size={28} name="chevron-down" color={selectedBackgroundColor} /> :
                            <FontAwesome size={28} name="chevron-right" color={selectedBackgroundColor} />
                    }
                </View>
            </Pressable>
            {showMenu && (
                <View>
                    {
                        showSearch &&
                        <TextInputField
                            inputMode="text"
                            onChangeText={setSearchText}
                            defaultValue='Search...'
                            secureTextEntry={false}
                            header=''
                            showHeader={false}
                        />
                    }
                    <View>
                        {filteredOptions.map((option: keyvalue) => (
                            <Pressable
                                key={option.key}
                                onPress={() => onItemClick(option)}
                            >
                                <Text
                                    style={
                                        isSelected(option) ?
                                            { ...baseStyles.selectItem, backgroundColor: selectedBackgroundColor, color: "white" } :
                                            { ...baseStyles.selectItem, color: lightColors.primaryColor, backgroundColor: "white" }
                                    }
                                >
                                    {option.value}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}
