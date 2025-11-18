import { ifrsService } from "../Gateways/ifrsService"

export const getAllCurrencies = async () => {
    try {
        const response = await ifrsService(`/Currency/GetAllCurrencies`, "GET")
        return response
    } catch (error) {
        return error
    }
}