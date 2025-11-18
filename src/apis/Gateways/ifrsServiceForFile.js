import axios from "axios";
import { sessionVariable } from "../../utils/enums/sessionStorage";
import { getSessionStorage } from "../Cruds/sessionCrud";
import { logoutSession } from "../../middlewares/SingleSession/SingleSession";

export const ifrsServieForFile = (endpoint, method, payload = null) => {
    const contentType = method === "GET" ? "application/json" : "multipart/form-data";
    const jwtToken = JSON.parse(getSessionStorage({ key: sessionVariable.token }));
    const authHeaders = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};
    const configaxios = {
        method,
        url: `${process.env.REACT_APP_IFRS_SERVICE_URL}${endpoint}`,
        data: payload,
        responseType: method === "GET" ? 'blob' : 'json', // 👈 important, because it’s binary
        headers: {
            Accept: "*/*",
            "Access-Control-Allow-Origin": "*",
            'Content-Type': contentType,
            "Access-Control-Max-Age": "6000",
            "Access-Control-Allow-Headers": "*",
            ...authHeaders,
        },
        // ...(username && password ? { auth: { username, password } } : {}),
    };
    return new Promise((resolve, reject) => {
        axios(configaxios)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                logoutSession(error)
                reject(error);
            });
    });
};