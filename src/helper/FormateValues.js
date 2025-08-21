import { getCompanyProfile, getSelectLease } from "../apis/Cruds/sessionCrud";

export function IRformatCurrency(value) {
    const selectedLease = getSelectLease()
    if (value < 0) {
        return 0
    }
    const isInt = Number.isInteger(value);
    const formatted = isInt
        ? value.toLocaleString('en-US', { maximumFractionDigits: 0 })
        : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${formatted} ${value ? (selectedLease?.currencyCode || "") : ""}`;
}

export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0]; // Extract the date part before 'T'
};

export function formatCurrency(value) {
    const companyProfile = getCompanyProfile();
    if (value < 0) {
        return 0;
    }
    const num = Number(value);
    const isInt = Number.isInteger(num);
    const formatted = isInt
        ? num.toLocaleString('en-US', { maximumFractionDigits: 0 })
        : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${formatted} ${value ? (companyProfile?.reportingCurrencyCode || "") : ""}`;
}

export function UnsignedformatCurrency(value) {
    const companyProfile = getCompanyProfile()
    const threshold = 1e-7; // Adjust this based on precision requirements
    const thresholdCheck = Math.abs(value) < threshold;
    return `${thresholdCheck ? "0" : Math.abs(value).toLocaleString('en-US')} ${(value && !thresholdCheck) ? (companyProfile?.reportingCurrencyCode || "") : ""}`;
}
export function SimpleformatCurrency(value) {
    if (value < 0) {
        return 0
    }
    return `${(Number(value?.toFixed(2))?.toLocaleString('en-US') || "")}`;
}

export function exchangeGainLoss(value) {
    const companyProfile = getCompanyProfile();
    const threshold = 1e-8; // Adjust this based on precision requirements
    const thresholdCheck = Math.abs(value) < threshold;
    if (thresholdCheck) return `0 ${companyProfile?.reportingCurrencyCode || ""}`;
    const absValue = Math.abs(value);
    const formatted = absValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const result = value < 0 ? `(${formatted})` : formatted;
    return `${result} ${companyProfile?.reportingCurrencyCode || ""}`;
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = date.toLocaleString('en-US', { month: 'short' }); // Get full month name
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
}