import { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import CustomButton from "../general/button";
import TextInputField from "../general/text_input";

import { baseStyles } from "@/styles/global";

const DEBOUNCE_DELAY: number = 500; // milliseconds

type durationInputParams = {
    duration: string,
    //expectedDuration: string,
    setDuration: (value: string) => void
}

export default function DurationInput({ duration, setDuration }: durationInputParams) {
    const [timerRunning, setTimerRunning] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [hours, setHours] = useState('0');
    const [minutes, setMinutes] = useState('0');
    const [seconds, setSeconds] = useState('0');
    const [totalSeconds, setTotalSeconds] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (duration.length > 0) {
            console.log(`duration: ${duration}`);
            // 00H00M00S
            setHours(duration.slice(0, 2));
            setMinutes(duration.slice(3, 5));
            setSeconds(duration.slice(6, 8));
        }
    }, [duration]);

    useEffect(() => {
        if (timerRunning) {
            intervalRef.current = setInterval(() => {
                setTotalSeconds((prev) => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [timerRunning]);

    function handleOnStart() {
        setTimerRunning(true);
        setTotalSeconds(0);
        setHours('0');
        setMinutes('0');
        setSeconds('0');
        setStartTime(Date.now());
    }

    function handleOnStop() {
        setTimerRunning(false);
        const stopTime = Date.now();
        const newTotal = (stopTime - startTime) / 1000;
        console.log(`total time: ${(stopTime - startTime) / 1000}`);
        const calculatedHours = Math.floor(newTotal / 3600).toString().padStart(2, "0");
        const calculatedMinutes = Math.floor((newTotal % 3600) / 60).toString().padStart(2, "0")
        const calculatedSeconds = Math.floor(newTotal % 60).toString().padStart(2, "0");
        console.log(`handleOnStop: ${calculatedHours + "H" + calculatedMinutes + "M" + calculatedSeconds + "S"}`);
        setHours(calculatedHours);
        setMinutes(calculatedMinutes);
        setSeconds(calculatedSeconds);
        setDuration(calculatedHours + ":" + calculatedMinutes + ":" + calculatedSeconds);
    }

    function handleHourInput(input: string) {
        setHours(input);
        setDuration(input.padStart(2, "0") + ":" + minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0"));
    }

    function handleMinuteInput(input: string) {
        setMinutes(input);
        setDuration(hours.padStart(2, "0") + ":" + input.padStart(2, "0") + ":" + seconds.padStart(2, "0"));
    }

    function handleSecondInput(input: string) {
        setSeconds(input);
        setDuration(hours.padStart(2, "0") + ":" + minutes.padStart(2, "0") + ":" + input.padStart(2, "0"));
    }

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600)
            .toString()
            .padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60)
            .toString()
            .padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <View>
            {
                timerRunning ?
                    <View style={baseStyles.spacedRow}>
                        <Text>{formatTime(totalSeconds)}</Text>
                        <CustomButton
                            text="Stop Timer"
                            onPress={handleOnStop}
                            disabled={false}
                        />
                    </View> :
                    <>
                        <CustomButton
                            text="Start Timer"
                            onPress={handleOnStart}
                            disabled={false}
                        />
                        {
                            duration.length > 0 &&
                            <View style={baseStyles.spacedRow}>
                                <TextInputField
                                    inputMode="numeric"
                                    onChangeText={handleHourInput}
                                    defaultValue={hours}
                                    secureTextEntry={false}
                                    header="Hour"
                                    showHeader={true}
                                />
                                <TextInputField
                                    inputMode="numeric"
                                    onChangeText={handleMinuteInput}
                                    defaultValue={minutes}
                                    secureTextEntry={false}
                                    header="Min"
                                    showHeader={true}
                                />
                                <TextInputField
                                    inputMode="numeric"
                                    onChangeText={handleSecondInput}
                                    defaultValue={seconds}
                                    secureTextEntry={false}
                                    header="Sec"
                                    showHeader={true}
                                />
                            </View>
                        }
                    </>
            }
        </View>
    );
}
