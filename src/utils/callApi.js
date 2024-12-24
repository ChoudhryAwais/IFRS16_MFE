import axios from "axios";
export const callApi = (endpoint, method, payload=null) => {
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
