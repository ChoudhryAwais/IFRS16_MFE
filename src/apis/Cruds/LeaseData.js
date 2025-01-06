import { callApi } from "../callApi"

export const addNewLease = async (leaseModal) => {
    try {
        const response = await callApi(`/LeaseFormData`, "POST", leaseModal)
        return response
    } catch (error) {
        return error
    }
}

export const getAllLeases = async (pageNumber,pageSize) => {
    try {
        const response = await callApi(`/LeaseFormData/GetAllLeases?pageNumber=${pageNumber}&pageSize=${pageSize}`, "GET")
        return response
    } catch (error) {
        return error
    }
}