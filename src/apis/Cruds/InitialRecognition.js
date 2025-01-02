import { callApi } from "../callApi"

export const getInitialRecognitionForLease = async (leaseId) => {
    try {
        const response = await callApi(`/InitialRecognition/${leaseId}`, "GET")
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