import { callApi } from "../callApi"

export const getRouScheduleForLease = async (pageNumber, pageSize, selectedLease) => {
    try {
        const response = await callApi(`/ROUSchedule?pageNumber=${pageNumber}&pageSize=${pageSize}&leaseId=${selectedLease.leaseId}`, "GET"
        )
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

