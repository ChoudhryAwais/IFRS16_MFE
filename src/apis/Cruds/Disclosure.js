import { callApi } from "../callApi"
import { getCompanyProfile } from "./sessionCrud"

export const getDisclosureReport = async (filter) => {
    const companyProfile = getCompanyProfile()
    const payload = { ...filter, companyId: companyProfile.companyID }
    const response = await callApi(`/Disclosure/Get`, "POST", payload)
    return response
}

export const getDisclosureMaturityReport = async (filter) => {
    const companyProfile = getCompanyProfile()
    const payload = { ...filter, companyId: companyProfile.companyID }
    const response = await callApi(`/Disclosure/GetDisclouserMaturityAnalysis`, "POST", payload)
    return response
}