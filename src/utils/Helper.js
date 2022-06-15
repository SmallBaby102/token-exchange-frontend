/* eslint-disable no-useless-escape */
const CLIENT_ACCESS_TOKEN = "client_access_token";
const CLIENT_REFRESH_TOKEN = "client_refresh_token";
// const CLIENT_USER_ID = "client_user_id";
const CLIENT_USERNAME = "client_username";
const REFRESH_TOKEN = "exchange_refresh_token";
const TOKEN_KEY = "exchange_access_token";
const EXPIRES_IN = "expires_in";
const USER_ID = "user_id";
const USERNAME = "username";
// const NOT_APPROVED = "0";
// const PENDING = "1";
// const COMPLETED = "2";

export const  CONFIGURATOR_USERNAME = "PlusqoAdmin2";
export const CONFIGURATOR_PASSWORD = "fY2ADeHDFkpVq%J18gaq";

class Helper {
  // Get File Extension
  static getFileEXT(string) {
    const temp = string.split(".");
    const ext = temp[temp.length - 1].toLowerCase();
    return ext;
  }

  static validateName(value) {
    const re = /^"[a-zA-Z0-9 \+._-]+"$/;
    return re.test(value);
  }

  // Validate Email
  static validateEmail(value) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value.toLowerCase());
  }

  // Please use a password with at least 8 characters including at least one number, one letter and one symbol
  static checkPassword(password) {
    if (password.length < 8) return false;

    let re = /[0-9]/;
    if (!re.test(password)) return false;

    re = /[a-zA-Z]/;
    if (!re.test(password)) return false;

    re = /(?=.*[.,=+;:\_\-?()\[\]<>{}!@#$%^&*])^[^'"]*$/;

    if (!re.test(password)) return false;

    return true;
  }

  // Capitalize First
  static capitalizeFirst(s) {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  static getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
  // Store User
  static storeUser(data) {
    localStorage.setItem(TOKEN_KEY, data.exchange_access_token);
    localStorage.setItem(USER_ID,   data.user_id);
    localStorage.setItem(USERNAME, data.username);
    localStorage.setItem(EXPIRES_IN, data.expires_in);
    localStorage.setItem(REFRESH_TOKEN, data.exchange_refresh_token);
    localStorage.setItem(CLIENT_USERNAME, data.client_username);
    localStorage.setItem(CLIENT_ACCESS_TOKEN, data.client_access_token);
    localStorage.setItem(CLIENT_REFRESH_TOKEN, data.client_refresh_token);
  }

  // Remove User
  static removeUser(url) {
    localStorage.removeItem(USERNAME);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(EXPIRES_IN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(CLIENT_USERNAME);
    localStorage.removeItem(CLIENT_ACCESS_TOKEN);
    localStorage.removeItem(CLIENT_REFRESH_TOKEN);
  }

  // Fetch User
  static fetchUser() {
    const jsonData = localStorage.getItem(USERNAME);
    if (jsonData) return JSON.parse(jsonData);
    return {};
  }
  
  // Adjust Numeric String
  static adjustNumericString(string, digit = 0) {
    if (isNaN(string) || string.trim() === "") return "";
    const temp = string.split(".");
    if (temp.length > 1) {
      const suffix = temp[1].substr(0, digit);
      return `${temp[0]}.${suffix}`;
    } else return string;
  }

  static isEmpty(obj) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  }
  static limitDecimal(t, n){
    var s;
    if (t === "" || t === null) {
      t = 0;
    }
    var string = String(t);
    var decimal = "";
    if (string.substr(0, string.indexOf(".")) === -1|| string.substr(0, string.indexOf(".")) === "") {
      for (let index = 0; index < n; index++) {
        decimal += "0";
      }   
      s = string  + "." +decimal;
    } else {
       decimal = string.substr(string.indexOf("."), n+1);
       let start = decimal.length -1;
       if(start < n){
        for (let index = start; index < n; index++) {
              decimal += "0";
        }
      } else {
         s = string.substr(0, string.indexOf(".")) + string.substr(string.indexOf("."), n+1);
         return s;
      }
      
      s = string.substr(0, string.indexOf(".")) +decimal;
      }
      return s;
  }  

}
export default Helper;
