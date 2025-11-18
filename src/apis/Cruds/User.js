import { identityService } from "../Gateways/identityService";
import { ifrsService } from "../Gateways/ifrsService"
export const updateUser = async (userData) => {
    try {
        const response = await identityService(`/User/Update`, "PUT", userData);
        return response;
    } catch (error) {
        return error;
    }
}
export const verifyPassword = async ({ userId, password }) => {
    try {
        const response = await identityService(`/User/VerifyPassword`, "POST", { userId, password });
        return response;
    } catch (error) {
        return error;
    }
}

export const registerUser = async (userModal) => {
    try {
        const response = await identityService(`/Registration`, "POST", userModal)
        return response
    } catch (error) {
        return error
    }
}

export const loginUser = async (loginModal) => {
    try {
        const response = await identityService(`/Login`, "POST", loginModal)
        return response
    } catch (error) {
        return error
    }
}
// Call logout API on server to invalidate session/token
export const logoutUser = async () => {
    try {
        const response = await ifrsService(`/Logout`, "POST");
        return response;
    } catch (error) {
        return error;
    }
}