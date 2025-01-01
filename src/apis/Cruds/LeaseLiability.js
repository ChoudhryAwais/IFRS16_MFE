import { callApi } from "../callApi"

export const getLeaseLiabilityForLease = async (payload) => {
    try {
        const response = await callApi(`/LeaseLiability`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}