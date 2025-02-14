export function getDateForCards() {
    const currentDate = formatDate(new Date());
    const startDate = formatDate(new Date(new Date().getFullYear(), 0, 1)) // January is 0-based
    return { currentDate, startDate }
}
function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}