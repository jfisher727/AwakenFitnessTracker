import { Text, View, useColorScheme, Pressable } from 'react-native';
import { useState, useEffect } from 'react';

import { gql, useLazyQuery } from '@apollo/client';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { baseStyles, lightColors, darkColors } from '@/styles/global';

import { date_formatter, getFirstDayOfMonth, getDaysInMonth, getMonthName } from '@/util/date';

import Spinner from '../general/spinner';

const GET_WORKOUTS = gql`
    query GetWorkouts($startMonth: Decimal, $startYear: Decimal) {
        workouts(startMonth: $startMonth, startYear: $startYear, template: false) {
            edges {
                node {
                    id
                    startTime
                    name
                }
            }
        }
    }
`;

type WorkoutNode = {
    node: {
        id: string,
        startTime: string,
        name: string,
    }
};

type CalendarGridParams = {
    month: number,
    year: number,
    events: WorkoutNode[],
    theme: string
};

function CalendarGrid({ month, year, events, theme }: CalendarGridParams) {
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const color = theme === 'light' ? lightColors.primaryColor : darkColors.primaryColor;
    const badgeColor = theme === 'light' ? lightColors.accent : darkColors.accent;

    const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const columnCount = 7;
    var rowCount = 5;

    if (firstDay >= 5 && daysInMonth >= 30) {
        rowCount = 6;
    }

    const totalCells = columnCount * rowCount;
    const datesArray = Array.from({ length: totalCells }, (_, i) => {
        const dayNumber = i - firstDay + 1;
        return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
    });

    const groupedEvents = events.reduce((acc, event) => {
        const date_string = date_formatter(event.node.startTime);
        if (!acc[date_string]) {
            acc[date_string] = [];
        }
        acc[date_string].push(event);
        return acc;
    }, {} as Record<string, WorkoutNode[]>);

    function handleCellPress(day: number | null) {
        if (day) {
            const formatted_date = date_formatter(new Date(year, month, day).toISOString());
            if (formatted_date in groupedEvents) {
                console.log(groupedEvents[formatted_date]);
            }
        }
    }

    function getEventsForDay(day: number) {
        const formatted_date = date_formatter(new Date(year, month, day).toISOString());
        return groupedEvents[formatted_date]?.length;
    }

    return (
        <View style={{ borderWidth: 1, borderColor: color }}>
            <View style={{ flexDirection: 'row' }}>
                {weekdayLabels.map((label) => (
                    <View key={label} style={{
                        ...baseStyles.cell,
                        backgroundColor: '#eee'
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 12,
                            color: color
                        }}>{label}</Text>
                    </View>
                ))}
            </View>
            {[...Array(rowCount)].map((_, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: 'row' }}>
                    {[...Array(columnCount)].map((_, colIndex) => {
                        const index = rowIndex * 7 + colIndex;
                        const day = datesArray[index];
                        var daysEvents = null;
                        if (day) {
                            daysEvents = getEventsForDay(day);
                        }
                        return (
                            <Pressable
                                style={baseStyles.cell}
                                key={colIndex}
                                onPress={() => {
                                    handleCellPress(day);
                                }}
                            >
                                <>
                                    {
                                        day &&
                                        <Text style={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            fontSize: 12,
                                            fontWeight: 'bold',
                                            color: color
                                        }}>{day ?? ''}</Text>
                                    }
                                    {
                                        daysEvents &&
                                        <View style={{ ...baseStyles.badge, backgroundColor: badgeColor }}>
                                            <Text style={baseStyles.badgeText}>{daysEvents}</Text>
                                        </View>
                                    }
                                </>
                            </Pressable>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

export default function Calendar() {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? lightColors.primaryColor : darkColors.primaryColor

    const now = new Date();

    const [month, setMonth] = useState(now.getMonth());
    const [year, setYear] = useState(now.getFullYear());

    const [execute, { loading, error, data }] = useLazyQuery(GET_WORKOUTS);

    useEffect(() => {
        const variables = { startMonth: month + 1, startYear: year };

        execute({
            variables: variables
        });
    }, [month, year]);

    if (error) {
        console.log(JSON.stringify(error));
    }

    function handleDecreaseMonth() {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        }
        else {
            setMonth(month - 1);
        }
    }

    function handleIncreaseMonth() {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        }
        else {
            setMonth(month + 1);
        }
    }

    return (
        <View>
            <View style={baseStyles.spacedRow}>
                <Pressable onPress={handleDecreaseMonth}>
                    <FontAwesome size={28} name="chevron-left" color={color} />
                </Pressable>
                <Text style={{ ...baseStyles.header, color: color }}>{getMonthName(month)}, {year}</Text>
                <Pressable onPress={handleIncreaseMonth}>
                    <FontAwesome size={28} name="chevron-right" color={color} />
                </Pressable>
            </View>
            {
                data &&
                <CalendarGrid month={month} year={year} events={data.workouts.edges} color={color} />
            }
            {
                loading &&
                <Spinner />
            }
        </View>
    );
}
