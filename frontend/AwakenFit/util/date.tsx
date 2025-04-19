export function date_formatter(isoString: string) {
    const date = new Date(isoString);

    // Example: Format as MM/DD/YYYY
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}
