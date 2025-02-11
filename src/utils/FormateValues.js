import { getCompanyProfile, getSelectLease } from "../apis/Cruds/sessionCrud";

export function IRformatCurrency(value) {
    const selectedLease = getSelectLease()
    if (value < 0) {
        return 0
    }
    return `${(value?.toLocaleString('en-US') || "")} ${value ? (selectedLease?.currencyCode || "") : ""}`;
}
export function formatCurrency(value) {
    const companyProfile = getCompanyProfile()
    if (value < 0) {
        return 0
    }
    return `${(value?.toLocaleString('en-US') || "")} ${value ? (companyProfile?.reportingCurrencyCode || "") : ""}`;
}

export function UnsignedformatCurrency(value) {
    const companyProfile = getCompanyProfile()
    const threshold = 1e-7; // Adjust this based on precision requirements
    const thresholdCheck = Math.abs(value) < threshold;
    return `${thresholdCheck ? "0" : Math.abs(value).toLocaleString('en-US')} ${(value && !thresholdCheck) ? (companyProfile?.reportingCurrencyCode || "") : ""}`;
}

export function exchangeGainLoss(value) {
    const companyProfile = getCompanyProfile()
    const threshold = 1e-8; // Adjust this based on precision requirements
    const thresholdCheck = Math.abs(value) < threshold;
    return `${thresholdCheck ? "0" : value.toLocaleString('en-US')} ${(value && !thresholdCheck) ? (companyProfile?.reportingCurrencyCode || "") : ""}`;
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = date.toLocaleString('en-US', { month: 'short' }); // Get full month name
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
}