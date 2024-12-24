import { callApi } from "../callApi"

export const registerUser = async (userModal) => {
    try {
        const response = await callApi(`/Registration`, "POST", userModal)
        return response
    } catch (error) {
        return error
    }
}

export const loginUser = async (loginModal) => {
    try {
        const response = await callApi(`/Login`, "POST", loginModal)
        return response
    } catch (error) {
        return error
    }
}