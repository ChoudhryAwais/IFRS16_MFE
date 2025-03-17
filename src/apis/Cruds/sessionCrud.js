import { sessionVariable } from "../../utils/enums/sessionStorage";

export const getUserInfo = () => {
    return JSON.parse(getSessionStorage({ key: sessionVariable.userInfo }))
}
export const getCompanyProfile = () => {
    return JSON.parse(getSessionStorage({ key: sessionVariable.companyProfile }))
}
export const getTotalLeases = () => {
    return JSON.parse(getSessionStorage({ key: sessionVariable.totalLeases }))
}
export const getSelectLease = () => {
    return JSON.parse(getSessionStorage({ key: sessionVariable.selectLease }))
}

export const setSessionStorage = ({ key, value }) => {
    sessionStorage.setItem(key, JSON.stringify(value));
}
export const getSessionStorage = ({ key }) => {
    return (sessionStorage.getItem(key));
}

export const removeSessionStorageVariable = ({ key }) => {
    sessionStorage.removeItem(key);
}