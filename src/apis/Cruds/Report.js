import { ifrsService } from "../Gateways/ifrsService"
import { getCompanyProfile } from "./sessionCrud"

export const getLeaseReportSummary = async (filter) => {
    const companyProfile = getCompanyProfile()
    const payload = { ...filter, companyId: companyProfile.companyID }
    try {
        const response = await ifrsService(`/Reports/LeaseReportSummary`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const getAllLeaseReport = async (filter) => {
    const companyProfile = getCompanyProfile()
    const payload = { ...filter, companyId: companyProfile.companyID }
    try {
        const response = await ifrsService(`/Reports/AllLeaseReport`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const getJournalEntryReport = async (filter) => {
    const companyProfile = getCompanyProfile()
    const payload = { ...filter, companyId: companyProfile.companyID }
    try {
        const response = await ifrsService(`/Reports/JournalEntryReport`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}
