import { callApi } from "../callApi"
import { getCompanyProfile } from "./sessionCrud"

export const getJournalEntriesForLease = async (pageNumber, pageSize, selectedLease) => {
    const companyProfile = getCompanyProfile()
    let fc_lease = selectedLease.currencyID === companyProfile.reportingCurrencyId ? 0 : 1
    try {
        const response = await callApi(`/JournalEntries?pageNumber=${pageNumber}&pageSize=${pageSize}&leaseId=${selectedLease.leaseId}&fc_lease=${fc_lease}`, "GET")
        return response
    } catch (error) {
        return error
    }
}