import { callApi, callApiForFile } from "../callApi"
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
export const getLeaseById = async (leaseId) => {
    try {
        const response = await callApi(`/LeaseFormData/GetLeaseById/${leaseId}`, "GET")
        return response
    } catch (error) {
        return error
    }
}

export const getAllLeasesforCompany = async () => {
    const companyProfile = getCompanyProfile()
    try {
        const response = await callApi(`/LeaseFormData/GetAllLeasesForCompany?companyId=${companyProfile.companyID}`, "GET")
        return response
    } catch (error) {
        return error
    }
}
export const deleteLeases = async (leasesId) => {
    try {
        const response = await callApi(`/LeaseFormData/Delete`, "POST", leasesId)
        return response
    } catch (error) {
        return error
    }
}
export const terminateLease = async (payload) => {
    try {
        const response = await callApi(`/LeaseFormData/TerminateLease`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const modifyLease = async (payload) => {
    try {
        const response = await callApi(`/LeaseFormData/ModifyLease`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const addLeaseContract = async (leaseContractModal) => {
    const response = await callApiForFile(`/LeaseFormData/UploadLeaseContract`, "POST", leaseContractModal)
    return response
}

export const getLeaseContract = async (leaseId) => {
    const response = await callApiForFile(`/LeaseFormData/GetLeaseContract/${leaseId}`, "GET")
    return response
}