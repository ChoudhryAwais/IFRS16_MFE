import { callApi } from "../callApi"

export const getRouScheduleForLease = async (payload) => {
    try {
        const response = await callApi(`/ROUSchedule`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}