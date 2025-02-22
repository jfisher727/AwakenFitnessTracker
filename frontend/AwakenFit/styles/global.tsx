import { StyleSheet } from "react-native";

export const darkColors = {
    primaryColor: "#00A19D",
    secondaryColor: "#FF8C42",
    accent: "#4FD1C5",
    background: "#121212"
}

export const lightColors = {
    primaryColor: "#008080",
    secondaryColor: "#FFA500",
    accent: "#66B2B2",
    background: "#F8F9FA"
};

const container = {
    flex: 1,
    padding: 16
};
const button = {
    padding: 12,
    borderRadius: 8,
    //alignItems: "center"
};

export const globalStyles = StyleSheet.create({
    lightContainer: {
        ...container,
        backgroundColor: lightColors.background
    },
    darkContainer: {
        ...container,
        backgroundColor: darkColors.background
    },
    text: {
        fontSize: 16,
        color: "#333"
    },
    lightButton: {
        backgroundColor: lightColors.secondaryColor,
        ...button,
    },
    darkButton: {
        backgroundColor: darkColors.secondaryColor,
        ...button
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
