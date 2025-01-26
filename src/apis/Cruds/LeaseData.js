import { callApi } from "../callApi"
import { getCompanyProfile } from "./sessionCrud"


export const addNewLease = async (leaseModal) => {
    try {
        const response = await callApi(`/LeaseFormData`, "POST", leaseModal)
        return response
    } catch (error) {
        return error
    }
}

export const addBulkLeases = async (leases) => {
    try {
        const response = await callApi(`/LeaseFormData/BulkImport`, "POST", leases)
        return response
    } catch (error) {
        return error
    }
}


export const getAllLeases = async (pageNumber, pageSize) => {
    const companyProfile = getCompanyProfile()
    try {
        const response = await callApi(`/LeaseFormData/GetAllLeases?pageNumber=${pageNumber}&pageSize=${pageSize}&companyID=${companyProfile.companyID}`, "GET")
        return response
    } catch (error) {
        return error
    }
}