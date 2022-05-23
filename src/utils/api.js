import NonceGenerator from 'a-nonce-generator';
import axios from 'axios';

import Helper from './Helper';

const ng = new NonceGenerator();
const nonce = ng.generate();

let apiUrl = `${process.env.REACT_APP_PLUSQO_URL}`;
let apiUrl2 = `${process.env.REACT_APP_PLUSQO_URL2}`;
let myServerUrl = `${process.env.REACT_APP_BACKEND_URL}`;
const api = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json'
    } 
});
export const myServerApi = () => {
    return axios.create({
        baseURL: myServerUrl,
        headers: {
            'Content-Type': 'application/json'
          }
    });
}
export const getAuthenticatedApi = () => {
    const accessToken = Helper.getAccessToken() || "";
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    return axios.create({
        baseURL: apiUrl,
        headers: headers,
    });
}
export const getAuthenticatedApi2 = () => {
    const accessToken = Helper.getAccessToken() || "";
    const headers = {
        'Accept': 'application/json',
        'x-deltix-nonce': nonce,
        'Authorization': `Bearer ${accessToken}`,
    };
    return axios.create({
        baseURL: apiUrl2,
        headers: headers,
    });
}

export default api;