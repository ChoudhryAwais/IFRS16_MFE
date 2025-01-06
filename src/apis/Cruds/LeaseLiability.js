import { callApi } from "../callApi"

export const getLeaseLiabilityForLease = async (pageNumber, pageSize, leaseId) => {
    try {
        const response = await callApi(`/LeaseLiability?pageNumber=${pageNumber}&pageSize=${pageSize}&leaseId=${leaseId}`, "GET")
        return response
    } catch (error) {
        return error
    }
}

export const postLeaseLiabilityForLease = async (payload) => {
    try {
        const response = await callApi(`/LeaseLiability/Add`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}