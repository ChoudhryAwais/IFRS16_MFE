export function formatCurrency(value) {
    if (value<0){
        return 0
    }
    return value.toLocaleString('en-US');
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = date.toLocaleString('en-US', { month: 'short' }); // Get full month name
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
}