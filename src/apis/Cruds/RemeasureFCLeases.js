import { ifrsService } from "../Gateways/ifrsService";

export const remeasureFCLeases = async (payload) => {
    try {
        const response = await ifrsService("/RemeasureFCLeases", "POST", payload);
        return response;
    } catch (error) {
        return error;
    }
};
