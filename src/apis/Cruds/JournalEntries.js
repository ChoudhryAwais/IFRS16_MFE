import { callApi } from "../callApi"

export const getJournalEntriesForLease = async (pageNumber, pageSize, selectedLease) => {
    try {
        const response = await callApi(`/JournalEntries?pageNumber=${pageNumber}&pageSize=${pageSize}&leaseId=${selectedLease.leaseId}`, "GET")
        return response
    } catch (error) {
        return error
    }
}