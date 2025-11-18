import { ifrsService } from "../Gateways/ifrsService"

export const getLeaseLiabilityForLease = async (payload) => {
    try {
        const response = await ifrsService(`/LeaseLiability/Get`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const getAllLeaseLiabilityForLease = async (leaseId) => {
    try {
        const response = await ifrsService(`/LeaseLiability/${leaseId}`, "GET")
        return response
    } catch (error) {
        return error
    }
}

export const postLeaseLiabilityForLease = async (payload) => {
    try {
        const response = await ifrsService(`/LeaseLiability/Add`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}