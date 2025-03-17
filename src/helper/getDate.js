export function getDateForCards() {
    const currentDate = formatDate(new Date());
    const startDate = formatDate(new Date(new Date().getFullYear(), 0, 1)) // January is 0-based
    return { currentDate, startDate }
}
function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function addOneDay(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return formatDate(newDate); // Ensure the date is formatted correctly
}
export function excelDateToJSDate(input) {
    if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
        // Already in YYYY-MM-DD format, return as is
        return input;
    } else if (!isNaN(input)) {
        // If it's a number (Excel serial date), convert it
        const excelEpoch = new Date(1899, 11, 30);
        const jsDate = new Date(excelEpoch.getTime() + (input + 1) * 86400000);
        return jsDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    } else {
        // Try to parse as a string date (e.g., MM/DD/YYYY or DD/MM/YYYY)
        const jsDate = new Date(input);
        if (!isNaN(jsDate.getTime())) {
            return jsDate.toISOString().split("T")[0];
        }
    }
    return null; // Return null if it's an invalid date
}