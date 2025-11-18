import axios from "axios";
import { sessionVariable } from "../../utils/enums/sessionStorage";
import { getSessionStorage } from "../Cruds/sessionCrud";
import { logoutSession } from "../../middlewares/SingleSession/SingleSession";
export const identityService = (endpoint, method, payload = null) => {
  // read jwt token from session storage
  const jwtToken = JSON.parse(getSessionStorage({ key: sessionVariable.token }));
  // build auth headers if token exists
  const authHeaders = jwtToken
    ? { Authorization: `Bearer ${jwtToken}` }
    : {};
  const configaxios = {
    method,
    url: `${process.env.REACT_APP_IDENTITY_SERVICE_URL}${endpoint}`,
    data: payload,
    headers: {
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Access-Control-Max-Age": "6000",
      "Access-Control-Allow-Headers": "*",
      // include Authorization when available
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


