/* eslint-disable */
import React, { useEffect } from 'react';

import jwt_decode from 'jwt-decode';
import LoadingOverlay from 'react-loading-overlay';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Route,
  useHistory,
} from 'react-router-dom';

import {
  autoLogin,
  setChecking,
  setAccountIntervalId,
  setQuoteIntervalId,
  setAccounts,
  setQuoteData,
  setCurrentPath,
  setCurrentUser
} from '../actions';
import { parseISO } from 'date-fns';

import Helper from '../utils/Helper';
import Http from '../utils/Http';
import { toast } from 'react-toastify';
import api, { myServerApi } from '../utils/api';

const PrivateRoute = ({ exact, component: Component, ...rest }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const checking = useSelector(state => state.user.checking);
  const current_acccountIntervalId = useSelector(state => state.user.accountIntervalId);
  const current_quoteIntervalId = useSelector(state => state.user.quoteIntervalId);
  const email = localStorage.getItem("username");
  const myApi = myServerApi(); 
  useEffect(() => {
    let search = window.location.search
    let pathname = window.location.pathname + search;
    let token = Helper.getAccessToken();
    if (token) {
      const decoded = jwt_decode(token);
      if (decoded.exp < Date.now() / 1000) {
        clearInterval(current_acccountIntervalId);
        clearInterval(current_quoteIntervalId);
        dispatch(setCurrentPath(pathname))
        history.push('/auth-login');
        return;
      } else {
        
        dispatch(autoLogin(history));
        if (!current_acccountIntervalId) {
            // dispatch(setChecking(true));
            const accountIntervalId = setInterval(() => {
                Http.getAccounts(localStorage.getItem("exchange_access_token"))
                .then((response) => {
                    if (response.status == 401){
                        history.push("auth-login");
                        // dispatch(setChecking(false));
                        clearInterval(accountIntervalId);
                        clearInterval(current_quoteIntervalId);
                    } else
                        dispatch(setAccounts(response));
                }).catch((e) => {
                  console.log("get accounts error", e)
                    // dispatch(setChecking(false));
                })
            }, 10000);   
            dispatch(setAccountIntervalId(accountIntervalId)); 
        }
        if (!current_quoteIntervalId) {
            // dispatch(setChecking(true));
            const quoteIntervalId = setInterval(() => {
                api.get("exchange/quotes?exchange=PLUSQO")
                .then((res) => {
                    let pairPriceArr = res.data;
                    dispatch(setQuoteData(pairPriceArr));
                    // dispatch(setChecking(false));
                })
                .catch((err) => {
                  console.log(err)
                  // dispatch(setChecking(false));
                // toast.error("Server error. Failed to get btc price");
                })
            }, 10000);   
            dispatch(setQuoteIntervalId(quoteIntervalId)); 
        
        }
      }
    } else {
      clearInterval(current_acccountIntervalId);
      clearInterval(current_quoteIntervalId);
       history.push('/auth-login');
    }
  }, []);
  useEffect(() => {
    if (email !== undefined)
      myApi.get(`profile/${email}`).then(res => {
        let user = res.data.data;
        if(user !== "")
        {  
          let useData = {
            department: (user.department !== null) ? user.department : "Individual",
            // individual relative state
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            birthday: (user.issue_date !== "" && user.issue_date !== null) ? parseISO(user.birthday) : null,
            issue_date: (user.issue_date !== "" && user.issue_date !== null) ? parseISO(user.issue_date) : null,
            exp_date: (user.exp_date !== "" && user.exp_date !== null) ? parseISO(user.exp_date) : null,
            issue_country: user.issue_country,
            // title : user.title,
            gener : user.gener,
            // marriage: user.marriage,
            // occupation: user.occupation,
            address: user.address,
            // id_cardtype: "",
            id_number: user.id_number,
            // id_issuer: user.id_issuer,
            city: user.city,
            country: user.country,
            prefecture: user.prefecture,
            postal_code: user.postal_code,
            cellphone_number: user.cellphone_number,
            country_code: user.country_code,
        
            // corporate relative state
            company_name: user.company_name,
            director_name: user.director_name,
            company_address: user.company_address,
            company_city: user.company_city,
            company_prefecture: user.company_prefecture,
            company_postal_code: user.company_postal_code,
            company_country_code: user.company_country_code,
            company_cellphone_number: user.company_cellphone_number,

            verification_status: user.verification_status,
          };
          dispatch(setCurrentUser(useData));
        }
      
      })
      .catch(err => {
      console.log('error: ', err);
      });
  }, [email])
  return (
    <LoadingOverlay active={checking} spinner>
      <Route exact={ exact ? true : false } rest render={ (props) => <Component {...props} {...rest}></Component> } />
    </LoadingOverlay>
  )
}

export default PrivateRoute;
