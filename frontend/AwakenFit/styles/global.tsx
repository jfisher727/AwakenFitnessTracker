import { StyleSheet } from "react-native";

export const darkColors = {
    primaryColor: "#00A19D",
    secondaryColor: "#446DF6",
    accent: "#4FD1C5",
    background: "#3A3335",
    buttonText: "#FAFAFA",
};

export const lightColors = {
    primaryColor: "#008080",
    secondaryColor: "#FFA500",
    accent: "#F0F0F0",
    background: "#FAFAFA",
    buttonText: "#FAFAFA",
};

export const baseStyles = StyleSheet.create({
    parent: {
        marginBottom: "4%",
    },
    container: {
        flex: 1,
        flexDirection: "column",
    },
    screenContainer: {
        flex: 1,
        height: "80%",
    },
    flatListContainer: {
        height: "60%",
    },
    buttonContainer: {
        justifyContent: "space-around",
    },
    header: {
        fontSize: 50,
        margin: 10,
        fontWeight: "bold",
    },
    mediumHeader: {
        fontSize: 40,
        margin: 10,
    },
    subHeader: {
        fontSize: 30,
        margin: 10,
    },
    modal: {
        flexDirection: "column",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        padding: 10,
        margin: 10,
    },
    shadowBox: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: 10,
        borderWidth: 1,
        padding: 15,
        marginTop: 10,
        marginBottom: 10,
        borderColor: darkColors.background,
    },
    setTextInput: {
        borderWidth: 1,
        backgroundColor: "#ffffff",
        borderColor: darkColors.background,
        borderRadius: 10,
        margin: 10,
        padding: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 100,
        height: 100,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    spacedRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    leftJustifiedRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 10,
    },
    selectableRow: {
        margin: 2,
        padding: 7,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    centeredRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    centeredColumn: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    selectHeader: {
        fontSize: 25,
        margin: 10,
    },
    selectItem: {
        borderRadius: 10,
        padding: 5,
        fontSize: 15,
    },
    cell: {
        flex: 1,
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
    badge: {
        position: "absolute",
        bottom: 4,
        right: 4,
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
    },
});
