export function allowDecimalNumbers(input) {
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (!regex.test(input)) {
        input = input.replace(/[^0-9.]/g, ''); // Remove non-numeric and non-decimal characters
        input = input.replace(/(\..*)\./g, '$1'); // Allow only one decimal point
    }
    return input
}
