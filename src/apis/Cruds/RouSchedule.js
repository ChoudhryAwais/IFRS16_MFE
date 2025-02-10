import { callApi } from "../callApi"
import { getCompanyProfile } from "./sessionCrud"

export const getRouScheduleForLease = async (pageNumber, pageSize, selectedLease) => {
    const companyProfile = getCompanyProfile()
    let fc_lease = selectedLease.currencyID === companyProfile.reportingCurrencyId ? 0 : 1
    try {
        const response = await callApi(`/ROUSchedule?pageNumber=${pageNumber}&pageSize=${pageSize}&leaseId=${selectedLease.leaseId}&fc_lease=${fc_lease}`, "GET"
        )
        return response
    } catch (error) {
        return error
    }
}

export const postRouScheduleForLease = async (payload) => {
    try {
        const response = await callApi(`/ROUSchedule/Add`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

