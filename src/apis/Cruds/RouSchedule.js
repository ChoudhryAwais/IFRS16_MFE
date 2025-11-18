import { ifrsService } from "../Gateways/ifrsService"

export const getRouScheduleForLease = async (payload) => {
    try {
        const response = await ifrsService(`/ROUSchedule/Get`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const getAllRouScheduleForLease = async (leaseId) => {
    try {
        const response = await ifrsService(`/ROUSchedule/${leaseId}`, "GET")
        return response
    } catch (error) {
        return error
    }
}

export const postRouScheduleForLease = async (payload) => {
    try {
        const response = await ifrsService(`/ROUSchedule/Add`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

