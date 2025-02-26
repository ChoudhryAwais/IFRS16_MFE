import { callApi } from "../callApi"

export const getInitialRecognitionForLease = async (payload) => {
    try {
        const response = await callApi(`/InitialRecognition/Get`, "POST", payload)
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