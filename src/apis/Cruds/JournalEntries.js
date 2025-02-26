import { callApi } from "../callApi"

export const getJournalEntriesForLease = async (payload) => {
    try {
        const response = await callApi(`/JournalEntries/Get`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}