import { sessionVariable } from "../enums/sessionStorage";

export const getUserInfo = () => {
    return JSON.parse(getSessionStorage({ key: sessionVariable.userInfo }))
}

export const setSessionStorage = ({ key, value }) => {
    sessionStorage.setItem(key, JSON.stringify(value));
}
export const getSessionStorage = ({ key }) => {
    return sessionStorage.getItem(key);
}

export const removeSessionStorageVariable = ({ key }) => {
    sessionStorage.removeItem(key);
}