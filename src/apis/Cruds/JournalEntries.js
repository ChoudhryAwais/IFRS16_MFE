import { callApi } from "../callApi"

export const getJournalEntriesForLease = async (pageNumber, pageSize, leaseId) => {
    try {
        const response = await callApi(`/JournalEntries?pageNumber=${pageNumber}&pageSize=${pageSize}&leaseId=${leaseId}`, "GET")
        return response
    } catch (error) {
        return error
    }
}