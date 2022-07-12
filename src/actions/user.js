import { toast } from 'react-toastify';

import api, { getAuthenticatedApi , myServerApi } from '../utils/api';
import Http from '../utils/Http';
import {
  LOGOUT,
  SET_CURRENT_PATH,
  SET_ACCOUNTS,
  SET_ACCOUNT_INTERVALID,
  SET_CHECKING,
  SET_CURRENT_USER,
  SET_LOADING,
  SET_USERS,
  SET_QUOTE,
  SET_QUOTE_INTERVALID,
  SET_DEPOSIT_ADDRESS
} from './type';

export const setCurrentPath = path => {
    return {
        type: SET_CURRENT_PATH,
        payload: path,
    }
}
export const setCurrentUser = user => {
    return {
        type: SET_CURRENT_USER,
        payload: user,
    }
}
export const setDepositAddress = address => {
    return {
        type: SET_DEPOSIT_ADDRESS,
        payload: address,
    }
}
export const setAccounts = data => {

    return {
        type: SET_ACCOUNTS,
        payload: data,
    }
}
export const setQuoteData = data => {

    return {
        type: SET_QUOTE,
        payload: data,
    }
}
export const setAccountIntervalId = data => {

    return {
        type: SET_ACCOUNT_INTERVALID,
        payload: data,
    }
}
export const setQuoteIntervalId = data => {

    return {
        type: SET_QUOTE_INTERVALID,
        payload: data,
    }
}

export const setChecking = checking => {
    return {
        type: SET_CHECKING,
        payload: checking,
    }
}

export const autoLogin = history => dispatch => {
    console.log("autologin entered")
    let email = localStorage.getItem("username");
    let authorization_value = localStorage.getItem("exchange_access_token");
    dispatch(setCurrentUser({ username : email} ));
   
   
    const myApi = myServerApi();
    myApi.get(`depositAddress/${email}/${"all"}`)
    .then((res) => {
        if (res.data.success === true && res.data.data !== null && res.data.data !== "") {
            const data = {
            btc_address : res.data.data.btc_address,
            usdt_address : res.data.data.usdt_address,
            eth_address : res.data.data.eth_address,
            }
            dispatch(setDepositAddress(data));    
        }
    })
    .catch((e) => {
        })
}

export const logout = history => {
    console.log("logout")
    localStorage.removeItem("exchange_access_token");
    history.push('/auth-login');
    return {
        type: LOGOUT,
    }
}

export const forgotPassword = ( email, history) => dispatch => {
    dispatch(setLoading(true)); 
    api.post('/authentication/user_authentication/startForgotPassword', {  exchange: "PLUSQO", username: email }).then(res => {
        if (res.data.result) {
            // toast.success('Verification code was sent to your mail box.');
            localStorage.setItem("username", email)
            history.push('resetpassword');
            dispatch(setLoading(false));
        }else {
            // toast.error('The account does not exist');
            dispatch(setLoading(false));
        }
    }).catch(err => {
        console.log('error: ', err);
        const msg = err.response.data.message;
        // toast.error(msg);
        dispatch(setLoading(false));
    });
}

export const resetPassword = (password, verificationCode, history) => dispatch => {
    dispatch(setLoading(true));
    const data = {
        password,
        code : verificationCode,
        exchange: "PLUSQO",
        username: localStorage.getItem("username")
    };
    api.post(`/authentication/user_authentication/completeForgotPassword/`, data).then(res => {
        if (res.data.result) {
            // toast.success('Your password has been successfully reset.');
            const myApi = myServerApi();
            myApi.post(`change_pap_password`, data).then(res => {
            })
            .catch (err => {
                console.log('error: ', err);
            });
            history.push('/login');
        } else {
            // toast.warn(t('input_correct_verification_code'));
        }
        dispatch(setLoading(false));
    }).catch (err => {
        console.log('error: ', err);
        dispatch(setLoading(false));
    });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////

export const setLoading = loading => {
    return {
        type: SET_LOADING,
        payload: loading,
    }
}

export const updateUser = (id, data, history, callback) => dispatch => {
    dispatch(setLoading(true));
    const secureApi = getAuthenticatedApi();
    
    dispatch(setLoading(true));
    secureApi.put(`/users/${id}`, data).then(res => {
        dispatch(setLoading(false));

        if (res && res.data) {
            if (res.data.step === 1) {
                dispatch(setLoading(false));
                history.push('/onboarding2');
            } else if (res.data.step === 2) {
                dispatch(setCurrentUser(res.data.data));
                dispatch(setLoading(false));
                history.push('/dashboard')
            } else {
                dispatch(getAllUsers());
                callback();
            }
        }
    }).catch(err => {
        console.log('error: ', err);
        dispatch(setLoading(false));
    });
}

export const getAllUsers = () => dispatch => {
    const secureApi = getAuthenticatedApi();
    secureApi.get('/users').then(res => {
        if (res && res.data && res.data.users) {
            dispatch({
                type: SET_USERS,
                payload: res.data.users,
            });
            dispatch(setLoading(false));
        }
    }).catch(err => {
        console.log('error: ', err);
        dispatch(setLoading(false));
    });
}

export const deleteUserById = id => dispatch => {
    dispatch(setLoading(true));
    const secureApi = getAuthenticatedApi();

    secureApi.delete(`/users/${id}`).then(res => {
        if (res && res.data) {
            dispatch(getAllUsers());
        } else {
            setLoading(false);
        }
    }).catch(err => {
        console.log('error: ', err);
        setLoading(false);
    })
}

export const deleteUsers = ids => dispatch => {
    dispatch(setLoading(true));
    const secureApi = getAuthenticatedApi();

    secureApi.post('/remove_users', { data:  ids }).then(res => {
        if (res && res.data) {
            dispatch(getAllUsers());
        } else {
            setLoading(false);
        }
    }).catch(err => {
        console.log('error: ', err);
        setLoading(false);
    });
}