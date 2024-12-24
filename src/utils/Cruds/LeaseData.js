import { callApi } from "../callApi"

export const addNewLease =async (leaseModal) => {
    try {
        const response = await callApi(`/LeaseFormData`, "POST", leaseModal)
        return response
    } catch (error) {
        return error
    }
}