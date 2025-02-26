import { callApi } from "../callApi"

export const getRouScheduleForLease = async (payload) => {
    try {
        const response = await callApi(`/ROUSchedule/Get`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const postRouScheduleForLease = async (payload) => {
    try {
        const response = await callApi(`/ROUSchedule/Add`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

