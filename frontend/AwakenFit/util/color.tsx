import { Float } from "react-native/Libraries/Types/CodegenTypes";

export const hexToRGBA = (hex: string, opacity: Float) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
