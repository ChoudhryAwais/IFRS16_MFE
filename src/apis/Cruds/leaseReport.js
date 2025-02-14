import { callApi } from "../callApi"

export const getLeaseReportSummary = async (filter) => {
    try {
        const response = await callApi(`/LeaseReport/LeaseReportSummary`, "POST", filter)
        return response
    } catch (error) {
        return error
    }
}

export const getAllLeaseReport = async (filter) => {
    try {
        const response = await callApi(`/LeaseReport/AllLeaseReport`, "POST", filter)
        return response
    } catch (error) {
        return error
    }
}
