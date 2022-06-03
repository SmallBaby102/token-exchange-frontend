import axios from 'axios';

/* eslint-disable */
import Helper from './Helper';

export const sendRequest = (
  url,
  params = {},
  method = "POST",
  requireAuth = false
) => {
  let headers = { "Content-Type": "application/json" };
  if (requireAuth) {
    const accessToken = Helper.getAccessToken() || "";

    headers = {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  // eslint-disable-next-line no-undef
  let apiUrl = `${process.env.REACT_APP_PLUSQO_URL}/${url}`;
  if (method === "GET") {
    const urlParams = [];
    for (let key in params) {
      if (key && params[key]) {
        urlParams.push(`${key}=${params[key]}`);
      }
    }
    if (urlParams.length) {
      apiUrl += `?${urlParams.join("&")}`;
    }
  }

  return new Promise((resolve) => {
    axios({
      method,
      headers,
      data: JSON.stringify(params),
      url: apiUrl,
    })
      .then((res) => {
        if (res.data) {
          let data = res.data;

          if (!data.success && !data.message) {
            data = {
              ...data,
              message: "Please try again later",
            };
          }
          resolve(data);
        } else {
          resolve({
            success: false,
            message: "Please try again later",
          });
        }
      })
      .catch((e) => {
        // Needs to login again
        // Helper.removeUser(url);

        resolve({
          success: false,
          message: "Please try again later",
        });
      });
  });
};

// const downloadRequest = (
//   url,
//   params = {},
//   requireAuth = false
// ) => {
//   let headers = { "Content-Type": "application/json" };
//   if (requireAuth) {
//     const userData = Helper.fetchUser();
//     const accessToken = userData.accessTokenAPI || "";

//     headers = {
//       ...headers,
//       Authorization: `Bearer ${accessToken}`,
//     };
//   }

//   // eslint-disable-next-line no-undef
//   let apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "api" + url;

//   const urlParams = [];
//   for (let key in params) {
//     if (key && params[key]) {
//       urlParams.push(`${key}=${params[key]}`);
//     }
//   }
//   if (urlParams.length) {
//     apiUrl += `?${urlParams.join("&")}`;
//   }

//   return new Promise((resolve) => {
//     axios({
//       method: "GET",
//       headers,
//       data: JSON.stringify(params),
//       url: apiUrl,
//       responseType: 'blob'
//     })
//       .then((res) => {
//         if (res.data) {
//           let data = res.data;
//           if (!data.success && !data.message) {
//             data = {
//               ...data,
//               message: "Please try again later",
//             };
//           }

//           resolve(data);
//         } else {
//           resolve({
//             success: false,
//             message: "Please try again later",
//           });
//         }
//       })
//       .catch(() => {
//         // Needs to login again
//         Helper.removeUser();

//         resolve({
//           success: false,
//           message: "Please try again later",
//         });
//       });
//   });
// };

// const uploadFile = (
//   url,
//   formData = null,
//   requireAuth = false
// ) => {
//   let headers = { "Content-Type": "multipart/form-data" };
//   if (requireAuth) {
//     const userData = Helper.fetchUser();
//     const accessToken = userData.accessTokenAPI || "";

//     headers = {
//       ...headers,
//       Authorization: `Bearer ${accessToken}`,
//     };
//   }

//   // eslint-disable-next-line no-undef
//   let apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "api" + url;
//   return new Promise((resolve) => {
//     axios.post(
//       apiUrl,
//       formData,
//       { headers }
//     )
//       .then((res) => {
//         if (res.data) {
//           let data = res.data;

//           if (!data.success && !data.message) {
//             data = {
//               ...data,
//               message: "Please try again later",
//             };
//           }

//           resolve(data);
//         } else {
//           resolve({
//             success: false,
//             message: "Please try again later",
//           });
//         }
//       })
//       .catch(() => {
//         // Needs to login again
//         Helper.removeUser();

//         resolve({
//           success: false,
//           message: "Please try again later",
//         });
//       });
//   });
// };

class Http {
  // Login
  static login(email, password) {
    const params = {
      username: email,
      password: password,
      twoFACode: "",
	    exchange: "PLUSQO"
    };
    return sendRequest("authentication/user_authentication/exchangeToken", params, "POST");
  }

  static register(params) {
    const data = {
      username: params.email,
      password: params.password,
      exchange: "PLUSQO",
      userAttributes: [
          {
            name: "custom:given_name",
            value: params.firstname
          },
          {
            name: "custom:surname",
            value: params.lastname
          },
          {
            name: "custom:country",
            value: params.country
          },
      ]
    }
    return sendRequest("authentication/user_authentication/signUp", data, "POST");
  }
  static confirmRegister(params) {
    const data = {
      username: localStorage.getItem("username"),
      code: params.verification_code,
      exchange: "PLUSQO"
    }
    return sendRequest("authentication/user_authentication/confirmSignUp", data, "POST");
  }
  static resendCode() {
    let data = {
      username: localStorage.getItem("username"),
	    exchange: "PLUSQO"
    }
    return sendRequest("authentication/user_authentication/resendSignUpCode", data, "POST");
  }
  static getAccounts(token) {
    const url = "trade/accounts";
    let headers = { "Content-Type": "application/json" };
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  
    // eslint-disable-next-line no-undef
    let apiUrl = `${process.env.REACT_APP_PLUSQO_URL}/${url}`;
    return new Promise((resolve) => {
      axios({
        method : "GET",
        headers,
        data: "",
        url: apiUrl,
      })
      .then((res) => {
        if (res.data) {
          let data = res.data;
          if (data.success) {
            data = {
              ...data,
              message: data.message,
            };
          }
          resolve(data);
        } else {
          resolve({
            success: false,
            message: "Request failed",
          });
        }
      })
      .catch((e) => {
        // Needs to login again
        Helper.removeUser(url);
        resolve(e.response);
        
      });
    });
  }

  static getUsers() {
    return sendRequest("users",{}, "get", true);
    
  }

  static storeUser(userData) {
    return sendRequest("users",userData, "Post", true);
    
  }
  static updateUser(id, userData) {
    return sendRequest("users/" + id, userData, "Put", true);
  }
  
  static deleteUser(id) {
  
    return sendRequest("users/"+id,{}, "Delete", true);
    
  }
  
  // Get Auth User
  static getMe() {
    return sendRequest("/me", {}, "GET", true);
  }

}

export default Http;
