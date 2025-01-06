import { callApi } from "../callApi"

export const getInitialRecognitionForLease = async (pageNumber, pageSize, leaseId) => {
    try {
        const response = await callApi(`/InitialRecognition?pageNumber=${pageNumber}&pageSize=${pageSize}&leaseId=${leaseId}`, "GET")
        return response
    } catch (error) {
        return error
    }
}

export const postInitialRecognitionForLease = async (leaseData) => {
    try {
        const response = await callApi(`/InitialRecognition/Add`, "POST", leaseData)
        return response
    } catch (error) {
        return error
    }
}