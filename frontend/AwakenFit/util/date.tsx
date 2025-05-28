export function date_formatter(isoString: string) {
    const date = new Date(isoString);

    // Example: Format as MM/DD/YYYY
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay(); // Sunday = 0, Monday = 1, ...
}

export function getDaysInMonth(year: number, month: number): number {
    /*
    From the documentation:
    Similarly, if any parameter underflows, it "borrows" from the higher positions.
    For example, new Date(2020, 5, 0) will return May 31st, 2020.
    */
    return new Date(year, month + 1, 0).getDate();
}

export function getMonthName(month: number) {
    const monthNames = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];
    return monthNames[month];
}
