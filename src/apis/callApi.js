import axios from "axios";
export const callApi = (endpoint, method, payload = null, username = "11214033", password = "60-dayfreetrial") => {
  // let token =
  //   Store.getState().Login && Store.getState().Login.logIn.payload.token;
  // const authHeaders = token
  //   ? {
  //       Authorization: `Bearer ${token}`,
  //     }
  //   : {};
  const configaxios = {
    method,
    url: `${process.env.REACT_APP_URL}${endpoint}`,
    data: payload,
    headers: {
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Access-Control-Max-Age": "6000",
      "Access-Control-Allow-Headers": "*",
    },
    ...(username && password ? { auth: { username, password } } : {}),
  };
  return new Promise((resolve, reject) => {
    axios(configaxios)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const callApiForFile = (endpoint, method, payload = null, username = "11214033", password = "60-dayfreetrial") => {
  const contentType = method === "GET" ? "application/json" : "multipart/form-data";
  const configaxios = {
    method,
    url: `${process.env.REACT_APP_URL}${endpoint}`,
    data: payload,
    responseType: method === "GET" ? 'blob' : 'json', // 👈 important, because it’s binary
    headers: {
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      'Content-Type': contentType,
      "Access-Control-Max-Age": "6000",
      "Access-Control-Allow-Headers": "*",
    },
    ...(username && password ? { auth: { username, password } } : {}),
  };
  return new Promise((resolve, reject) => {
    axios(configaxios)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
