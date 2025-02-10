import { callApi } from "../callApi"

export const getLeaseReport = async (filter) => {
    try {
        const response = await callApi(`/LeaseReport`, "POST", filter)
        return response
    } catch (error) {
        return error
    }
}
