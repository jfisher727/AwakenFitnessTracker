import { StyleSheet } from "react-native";

export const darkColors = {
    primaryColor: "#00A19D",
    secondaryColor: "#446DF6",
    accent: "#4FD1C5",
    background: "#3A3335",
    buttonText: "#FAFAFA"
}

export const lightColors = {
    primaryColor: "#008080",
    secondaryColor: "#FFA500",
    accent: "#F0F0F0",
    background: "#FAFAFA",
    buttonText: "#FAFAFA"
};


export const baseStyles = StyleSheet.create({
    parent: {
        marginBottom: '4%',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        fontSize: 50,
        margin: 10,
        fontWeight: "bold",
    },
    subHeader: {
        fontSize: 30,
        margin: 10
    },
    modal: {
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        padding: 10,
        margin: 10
    },
    shadowBox: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: 10,
        borderWidth: 1,
        padding: 15,
        marginTop: 10,
        marginBottom: 10,
        borderColor: darkColors.background,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    }
});

const light = StyleSheet.create({
    container: {
        backgroundColor: lightColors.background,
    },
    header: {
        color: lightColors.primaryColor
    },
    subHeader: {
        color: lightColors.primaryColor,
    },
    button: {
        backgroundColor: lightColors.secondaryColor,
    }
});

const dark = StyleSheet.create({
    container: {
        backgroundColor: darkColors.background,
    },
    header: {
        color: darkColors.primaryColor
    },
    subHeader: {
        color: darkColors.primaryColor,
    },
    button: {
        backgroundColor: darkColors.secondaryColor,
    }
});
