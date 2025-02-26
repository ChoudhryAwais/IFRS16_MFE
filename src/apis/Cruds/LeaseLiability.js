import { callApi } from "../callApi"

export const getLeaseLiabilityForLease = async (payload) => {
    try {
        const response = await callApi(`/LeaseLiability/Get`, "POST", payload)
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