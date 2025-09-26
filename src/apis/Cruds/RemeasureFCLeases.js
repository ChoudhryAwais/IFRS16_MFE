import { callApi } from "../callApi";

export const remeasureFCLeases = async (payload) => {
    try {
        const response = await callApi("/RemeasureFCLeases", "POST", payload);
        return response;
    } catch (error) {
        return error;
    }
};
