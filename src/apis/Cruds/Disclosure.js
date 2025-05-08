import { callApi } from "../callApi"

export const getDisclosureReport = async (filter) => {
    const response = await callApi(`/Disclosure/Get`, "POST", filter)
    return response
}