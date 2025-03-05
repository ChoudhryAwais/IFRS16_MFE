import { callApi } from "../callApi"

export const getLeaseReportSummary = async (filter) => {
    try {
        const response = await callApi(`/Reports/LeaseReportSummary`, "POST", filter)
        return response
    } catch (error) {
        return error
    }
}

export const getAllLeaseReport = async (filter) => {
    try {
        const response = await callApi(`/Reports/AllLeaseReport`, "POST", filter)
        return response
    } catch (error) {
        return error
    }
}

export const getJournalEntryReport = async (filter) => {
    try {
        const response = await callApi(`/Reports/JournalEntryReport`, "POST", filter)
        return response
    } catch (error) {
        return error
    }
}
