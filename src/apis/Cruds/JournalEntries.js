import { ifrsService } from "../Gateways/ifrsService"

export const getJournalEntriesForLease = async (payload) => {
    try {
        const response = await ifrsService(`/JournalEntries/Get`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const getAllJournalEntriesForLease = async (leaseId) => {
    try {
        const response = await ifrsService(`/JournalEntries/${leaseId}`, "GET")
        return response
    } catch (error) {
        return error
    }
}