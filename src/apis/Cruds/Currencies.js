import { callApi } from "../callApi"

export const getAllCurrencies = async () => {
    try {
        const response = await callApi(`/Currency/GetAllCurrencies`, "GET")
        return response
    } catch (error) {
        return error
    }
}