import { clearAllSessionStorage } from "../../apis/Cruds/sessionCrud";

export const logoutSession = (error) => {
    const invalidMsg = "Session invalid or logged out from another device.";
    const serverMsg = error?.response?.data || error?.response?.data?.message || "";
    if (typeof serverMsg === 'string' && serverMsg.includes(invalidMsg)) {
        clearAllSessionStorage();
        window.location.href = "/";
    }
}

