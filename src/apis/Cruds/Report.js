import { callApi } from "../callApi"
import { getCompanyProfile } from "./sessionCrud"

export const getLeaseReportSummary = async (filter) => {
    const companyProfile = getCompanyProfile()
    const payload = { ...filter, companyId: companyProfile.companyID }
    debugger
    try {
        const response = await callApi(`/Reports/LeaseReportSummary`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const getAllLeaseReport = async (filter) => {
    const companyProfile = getCompanyProfile()
    const payload = { ...filter, companyId: companyProfile.companyID }
    try {
        const response = await callApi(`/Reports/AllLeaseReport`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const getJournalEntryReport = async (filter) => {
    const companyProfile = getCompanyProfile()
    const payload = { ...filter, companyId: companyProfile.companyID }
    try {
        const response = await callApi(`/Reports/JournalEntryReport`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}
