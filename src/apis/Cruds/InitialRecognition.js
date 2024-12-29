import { callApi } from "../callApi"

export const getInitialRecognitionForLease = async (leaseData) => {
    try {
        const response = await callApi(`/InitialRecognition`, "POST", leaseData)
        return response
    } catch (error) {
        return error
    }
}