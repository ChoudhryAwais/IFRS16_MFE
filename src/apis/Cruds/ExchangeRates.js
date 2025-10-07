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

// Batch endpoint to send selected exchange rate IDs as a comma-separated string
export const batchExchangeRatesByIds = async (idsString) => {
    try {
        const response = await callApi(`/ExchangeRate/batch/${idsString}`, "DELETE");
        return response;
    } catch (error) {
        return error;
    }
};
