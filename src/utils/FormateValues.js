export function formatCurrency(value) {
    return value.toLocaleString('en-US');
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = date.toLocaleString('en-US', { month: 'long' }); // Get full month name
    const year = date.getFullYear();

    return `${day} ${month},${year}`;
}