import { useEffect, useCallback, useReducer } from "react";
import * as SecureStore from "expo-secure-store";
import { File, Directory, Paths } from "expo-file-system/next";
// import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
    return useReducer(
        (
            state: [boolean, T | null],
            action: T | null = null
        ): [boolean, T | null] => [false, action],
        initialValue
    ) as UseStateHook<T>;
}

export async function storeData(key: string, value: string | null) {
    if (value === null) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, value);
    }
}

export async function storeAppState(value: string | null) {
    console.log("store app state called");
    try {
        const file = new File(Paths.cache, "state.json");
        if (file.exists) {
            file.delete();
        }
        console.log(value);
        if (value === null) {
            console.log("no value provided, removing file");
            if (file.exists) {
                file.delete();
            }
        } else {
            console.log(value);
            file.create(); // can throw an error if the file already exists or no permission to create it
            file.write(value);
            //console.log(file.textSync()); // Hello, world!
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getAppState() {
    const file = new File(Paths.cache, "state.json");
    const content = file.text();
    file.delete();
    return content;
}

export async function getData(key: string) {
    return localStorage.getItem(key);
}

export async function setStorageItemAsync(key: string, value: string | null) {
    if (Platform.OS === "web") {
        try {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.error("Local storage is unavailable:", e);
        }
    } else {
        if (value == null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    }
}

export function useStorageState(key: string): UseStateHook<string> {
    // Public
    const [state, setState] = useAsyncState<string>();

    // Get
    useEffect(() => {
        if (Platform.OS === "web") {
            try {
                if (typeof localStorage !== "undefined") {
                    setState(localStorage.getItem(key));
                }
            } catch (e) {
                console.error("Local storage is unavailable:", e);
            }
        } else {
            SecureStore.getItemAsync(key).then((value) => {
                setState(value);
            });
        }
    }, [key]);

    // Set
    const setValue = useCallback(
        (value: string | null) => {
            setState(value);
            setStorageItemAsync(key, value);
        },
        [key]
    );

    return [state, setValue];
}
