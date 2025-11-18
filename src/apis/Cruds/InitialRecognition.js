import { ifrsService } from "../Gateways/ifrsService"

export const getInitialRecognitionForLease = async (payload) => {
    try {
        const response = await ifrsService(`/InitialRecognition/Get`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const getAllInitialRecognitionForLease = async (leaseId) => {
    try {
        const response = await ifrsService(`/InitialRecognition/${leaseId}`, "GET")
        return response
    } catch (error) {
        return error
    }
}
export const modifyInitialRecognitionForLease = async (leaseData) => {
    try {
        const response = await ifrsService(`/InitialRecognition/Modify`, "POST", leaseData)
        return response
    } catch (error) {
        return error
    }
}


export const postInitialRecognitionForLease = async (leaseData) => {
    try {
        const response = await ifrsService(`/InitialRecognition/Add`, "POST", leaseData)
        return response
    } catch (error) {
        return error
    }
}