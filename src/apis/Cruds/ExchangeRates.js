import { callApi } from "../callApi";

export const getExchangeRatesByCurrency = async (currencyId) => {
    try {
        const response = await callApi(`/ExchangeRate/all/${currencyId}`, "GET");
        return response;
    } catch (error) {
        return error;
    }
};

export const addExchangeRate = async (payload) => {
    try {
        const response = await callApi(`/ExchangeRate`, "POST", payload);
        return response;
    } catch (error) {
        return error;
    }
};
